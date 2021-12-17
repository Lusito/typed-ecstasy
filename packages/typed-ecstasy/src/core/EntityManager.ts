/* eslint-disable dot-notation */
import { Entity } from "./Entity";
import { Family } from "./Family";
import { createDelayedOperations } from "../utils/DelayedOperations";
import { EntitySignal } from "./EntitySignal";
import { Allocator } from "./Allocator";
import { ComponentData, ComponentType } from "./Component";

interface FamilyMeta {
    family: Family;
    entities: Entity[];
    onAdd?: EntitySignal;
    onRemove?: EntitySignal;
}

/**
 * A manager for all entities. It is responsible for keeping track of Entities.
 */
export class EntityManager {
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
        addComponent: <T extends ComponentData<unknown>>(e: Entity, component: T) => {
            e["addInternal"](component);
            this.updateFamily(e);
        },
        removeComponent: (e: Entity, type: ComponentType) => {
            e["removeInternal"](type.id);
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
     * @param allocator The allocator to use for freeing entities.
     */
    public constructor(allocator: Allocator) {
        this.allocator = allocator;
    }

    protected set delayOperations(shouldDelay: boolean) {
        this.#delayOperations = shouldDelay;
        this.delayedOperations.shouldDelay = this.#delayOperations || this.#notifying;
    }

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
        entity["manager"] = this;
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
     * Request the update of an entities families. For internal use.
     *
     * @internal
     * @param entity The entity to update.
     */
    protected updateFamily(entity: Entity) {
        this.delayedOperations.updateFamily(entity);
    }

    private updateFamilyInternal(entity: Entity) {
        if (entity["scheduledForRemoval"]) return;

        const families = entity.getFamilies() as Set<Family>;
        for (const { family, entities } of this.familyMeta) {
            const belongsToFamily = families.has(family);
            const matches = family.matches(entity);

            if (!belongsToFamily && matches) {
                entities.push(entity);
                families.add(family);

                this.notifyFamilyListenersAdd(family, entity);
            } else if (belongsToFamily && !matches) {
                const familyEntities = entities;
                const index = familyEntities.indexOf(entity);
                /* istanbul ignore else: this will never happen */
                if (index !== -1) familyEntities.splice(index, 1);
                families.delete(family);

                this.notifyFamilyListenersRemove(family, entity);
            }
        }
    }

    protected removeInternal(entity: Entity) {
        if (entity["manager"]) {
            const index = this.entities.indexOf(entity);
            if (index === -1) throw new Error("Entity does not belong to this manager");
            this.entities.splice(index, 1);
            this.entitiesById.delete(entity.getId());

            const families = entity.getFamilies() as Set<Family>;
            if (!families.size) {
                for (const { family, entities } of this.familyMeta) {
                    if (family.matches(entity)) {
                        const index2 = entities.indexOf(entity);
                        /* istanbul ignore else: this will never happen */
                        if (index2 !== -1) entities.splice(index2, 1);

                        families.delete(family);
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
        const meta = this.familyMeta.find((m) => m.family === family);
        if (meta?.onAdd) {
            this.notifying = true;
            meta.onAdd.emit(entity);
            this.notifying = false;
        }
    }

    private notifyFamilyListenersRemove(family: Family, entity: Entity) {
        const meta = this.familyMeta.find((m) => m.family === family);
        if (meta?.onRemove) {
            this.notifying = true;
            meta.onRemove.emit(entity);
            this.notifying = false;
        }
    }

    private registerFamily(family: Family) {
        let meta = this.familyMeta.find((m) => m.family === family);
        if (!meta) {
            const entities: Entity[] = [];
            for (const e of this.entities) {
                if (family.matches(e)) {
                    entities.push(e);
                    e["families"].add(family);
                }
            }
            meta = { family, entities };
            this.familyMeta.push(meta);
        }
        return meta;
    }
}
