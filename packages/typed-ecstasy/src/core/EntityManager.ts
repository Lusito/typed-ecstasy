/* eslint-disable dot-notation */
import { Entity } from "./Entity";
import { Family } from "./Family";
import { createDelayedOperations } from "../utils/DelayedOperations";
import { EntitySignal } from "./EntitySignal";
import type { Engine } from "./Engine";
import { Component, ComponentConstructor } from "./Component";
import { Allocator } from "./Allocator";

interface FamilyMeta {
    family: Family;
    entities: Entity[];
    onAdd?: EntitySignal;
    onRemove?: EntitySignal;
}

/**
 * A manager for all entities in an engine. It is responsible for keeping track of Entities.
 */
export class EntityManager {
    private readonly engine: Engine;

    private readonly allocator: Allocator;

    private readonly entities: Entity[] = [];

    private readonly entitiesById = new Map<number, Entity>();

    private readonly familyMeta: FamilyMeta[] = [];

    private nextEntityId = 1;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    #notifying = false;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    #delayOperations = false;

    // Mechanism to delay operations to avoid affecting system processing
    private delayedOperations = createDelayedOperations({
        add: (e: Entity) => this.addInternal(e),
        remove: (e: Entity) => this.removeInternal(e),
        removeAll: () => this.removeAllInternal(),
        updateFamily: (e: Entity) => this.updateFamilyInternal(e),
        addComponent: <T extends Component>(e: Entity, component: T) => {
            e["addInternal"](component);
            this.updateFamily(e);
        },
        removeComponent: (e: Entity, clazz: ComponentConstructor) => {
            e["removeInternal"](clazz);
            this.updateFamily(e);
        },
        removeAllComponents: (e: Entity) => {
            e["removeAllInternal"]();
            this.updateFamily(e);
        },
    });

    /** Will dispatch an event after an entity has been added. */
    public readonly onAdd = new EntitySignal();

    /** Will dispatch an event after an entity has been removed. */
    public readonly onRemove = new EntitySignal();

    /**
     * Creates a new EntityManager.
     *
     * @param engine The engine of this manager.
     * @param allocator The allocator to use for freeing entities.
     */
    public constructor(engine: Engine, allocator: Allocator) {
        this.engine = engine;
        this.allocator = allocator;
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected set delayOperations(shouldDelay: boolean) {
        this.#delayOperations = shouldDelay;
        this.delayedOperations.shouldDelay = this.#delayOperations || this.#notifying;
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected set notifying(notifying: boolean) {
        this.#notifying = notifying;
        this.delayedOperations.shouldDelay = this.#delayOperations || this.#notifying;
    }

    /**
     * Adds an entity to this manager.
     *
     * @param entity The entity to add.
     * @throws If the entity has already been added to an entity manager.
     */
    public add(entity: Entity) {
        if (entity["uuid"] !== 0) throw new Error("Entity already added to an entity manager");
        entity["uuid"] = this.nextEntityId++;
        entity["manager"] = this.engine.entities;
        this.delayedOperations.add(entity);
    }

    /**
     * Removes an entity.
     *
     * @param entity The entity to remove.
     */
    public remove(entity: Entity) {
        if (!entity["scheduledForRemoval"]) {
            entity["scheduledForRemoval"] = true;
            this.delayedOperations.remove(entity);
        }
    }

    /**
     * Removes all entities.
     */
    public removeAll() {
        for (const entity of this.entities) entity["scheduledForRemoval"] = true;
        this.delayedOperations.removeAll();
    }

    /**
     * @param id The id of an {@link Entity}.
     * @returns The entity associated with the specified id or undefined if no such entity exists.
     */
    public get(id: number) {
        return this.entitiesById.get(id);
    }

    /** @returns A list of all entities. */
    public getAll() {
        return this.entities;
    }

    /**
     * @param family A Family instance.
     * @returns A list of entities for the specified Family. Will return the same instance every time.
     */
    public forFamily(family: Family) {
        return this.registerFamily(family).entities;
    }

    /**
     * @param family A Family instance.
     * @returns The EntitySignal which emits when an entity is added to the specified Family.
     */
    public onAddForFamily(family: Family) {
        const meta = this.registerFamily(family);
        meta.onAdd ??= new EntitySignal();
        return meta.onAdd;
    }

    /**
     * @param family A Family instance.
     * @returns The EntitySignal which emits when an entity is removed from the specified Family.
     */
    public onRemoveForFamily(family: Family) {
        const meta = this.registerFamily(family);
        meta.onRemove ??= new EntitySignal();
        return meta.onRemove;
    }

    /**
     * Request the update of an entities family bits. For internal use.
     *
     * @internal
     * @param entity The entity to update.
     */
    protected updateFamily(entity: Entity) {
        this.delayedOperations.updateFamily(entity);
    }

    private updateFamilyInternal(entity: Entity) {
        if (entity["scheduledForRemoval"]) return;

        // eslint-disable-next-line prefer-destructuring
        const familyBits = entity["familyBits"];
        for (const key of Object.keys(this.familyMeta)) {
            const { family, entities } = this.familyMeta[+key];
            const belongsToFamily = familyBits.get(family.index);
            const matches = family.matches(entity);

            if (!belongsToFamily && matches) {
                entities.push(entity);
                familyBits.set(family.index);

                this.notifyFamilyListenersAdd(family, entity);
            } else if (belongsToFamily && !matches) {
                const familyEntities = entities;
                const index = familyEntities.indexOf(entity);
                /* istanbul ignore else: this will never happen */
                if (index !== -1) familyEntities.splice(index, 1);
                familyBits.clear(family.index);

                this.notifyFamilyListenersRemove(family, entity);
            }
        }
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected removeInternal(entity: Entity) {
        if (entity["manager"]) {
            const index = this.entities.indexOf(entity);
            if (index === -1) throw new Error("Entity does not belong to this engine");
            this.entities.splice(index, 1);
            this.entitiesById.delete(entity.getId());

            // eslint-disable-next-line prefer-destructuring
            const familyBits = entity["familyBits"];
            if (!familyBits.isEmpty()) {
                for (const key of Object.keys(this.familyMeta)) {
                    const { family, entities } = this.familyMeta[+key];
                    if (family.matches(entity)) {
                        const index2 = entities.indexOf(entity);
                        /* istanbul ignore else: this will never happen */
                        if (index2 !== -1) entities.splice(index2, 1);

                        familyBits.clear(family.index);
                        this.notifyFamilyListenersRemove(family, entity);
                    }
                }
            }

            this.notifying = true;
            this.onRemove.emit(entity);
            this.notifying = false;

            this.allocator.freeEntity(entity);
        }
    }

    private removeAllInternal() {
        const entities = this.getAll();
        while (entities.length) {
            this.removeInternal(entities[entities.length - 1]);
        }
    }

    private addInternal(entity: Entity) {
        this.entities.push(entity);
        this.entitiesById.set(entity.getId(), entity);

        this.updateFamilyInternal(entity);

        this.notifying = true;
        this.onAdd.emit(entity);
        this.notifying = false;
    }

    private notifyFamilyListenersAdd(family: Family, entity: Entity) {
        const meta = this.familyMeta[family.index];
        if (meta.onAdd) {
            this.notifying = true;
            meta.onAdd.emit(entity);
            this.notifying = false;
        }
    }

    private notifyFamilyListenersRemove(family: Family, entity: Entity) {
        const meta = this.familyMeta[family.index];
        if (meta.onRemove) {
            this.notifying = true;
            meta.onRemove.emit(entity);
            this.notifying = false;
        }
    }

    private registerFamily(family: Family) {
        let meta = this.familyMeta[family.index];
        if (!meta) {
            const entities: Entity[] = [];
            for (const e of this.entities) {
                if (family.matches(e)) {
                    entities.push(e);
                    e["familyBits"].set(family.index);
                }
            }
            meta = { family, entities };
            this.familyMeta[family.index] = meta;
        }
        return meta;
    }
}
