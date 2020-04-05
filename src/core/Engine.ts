import { Entity } from "./Entity";
import { EntitySystem } from "./EntitySystem";
import { UniqueType } from "./UniqueType";
import { Family } from "./Family";
import { EntityFactory } from "../utils/EntityFactory";
import { Constructor } from "../utils/Constructor";
import { Lookup } from "../utils/Lookup";
import { DelayedOperationHandler } from "../utils/DelayedOperationHandler";
import { Bits } from "../utils/Bits";
import { EntitySignal } from "./EntitySignal";

function compareSystems(a: EntitySystem, b: EntitySystem) {
    return a.getPriority() - b.getPriority();
}

interface FriendlySystem {
    addedToEngine(engine: Engine): void;
    removedFromEngine(engine: Engine): void;
}

interface FriendlyEntity {
    uuid: number;
    scheduledForRemoval: boolean;
    readonly familyBits: Bits;
    engine: Engine | null;
}

/**
 * The heart of the Entity framework. It is responsible for keeping track of Entity and
 * managing EntitySystem objects. The Engine should be updated every tick via the update(float) method.
 *
 * With the Engine you can:
 *
 * - Create entities using createEntity()
 * - Add/Remove Entity objects
 * - Add/Remove {@link EntitySystem}s
 * - Obtain a list of entities for a specific Family
 * - Update the main loop
 * - Connect to/Disconnect from EntitySignal
 */
export class Engine {
    private entities: Entity[] = [];

    private entitiesById: { [s: number]: Entity } = {};

    private systems: EntitySystem[] = [];

    private systemsByType: { [s: string]: EntitySystem } = {};

    private entitiesByFamily: { [s: string]: Entity[] } = {};

    private entityAddedSignals: { [s: string]: EntitySignal } = {};

    private entityRemovedSignals: { [s: string]: EntitySignal } = {};

    private entityFactory: EntityFactory | null = null;

    private updating = false;

    private notifying = false;

    private nextEntityId = 1;

    private entityFamilyUpdates: Entity[] = [];

    // Mechanism to delay component addition/removal to avoid affecting system processing
    private entityOperationHandler: DelayedOperationHandler<Entity>;
    // private systemOperationHandler: DelayedOperationHandler<EntitySystem>;

    /** Will dispatch an event when an entity is added. */
    public readonly entityAdded = new EntitySignal();

    /** Will dispatch an event when an entity is removed. */
    public readonly entityRemoved = new EntitySignal();

    /** Store and look up instances of classes. */
    public readonly lookup = new Lookup();

    /**
     * Creates a new Engine.
     */
    public constructor() {
        this.entityOperationHandler = new DelayedOperationHandler<Entity>({
            onAdd: this.addEntityInternal,
            onRemove: this.removeEntityInternal,
            onRemoveAll: this.removeAllEntitiesInternal,
        });
        // this.systemOperationHandler = new DelayedOperationHandler<EntitySystem>({
        // 	onAdd: this.addSystemInternal.bind(this),
        // 	onRemove: this.removeSystemInternal.bind(this),
        // 	onRemoveAll: this.removeAllSystemsInternal.bind(this)
        // });
    }

    /**
     * @return true if this engine is currently updating systems.
     */
    public isUpdating() {
        return this.updating;
    }

    /**
     * Remove all entities and systems.
     */
    public destroy() {
        do {
            this.removeAllEntities();
            this.processEntityFamilyUpdates();
            this.entityOperationHandler.process();
        } while (this.entities.length);

        this.removeAllSystems();
    }

    /** @return A new Entity. In order to add it to the Engine, use addEntity(Entity). */
    public createEntity() {
        return new Entity();
    }

    /**
     * Creates and assembles an Entity using the EntityFactory.
     * In order to add it to the Engine, use addEntity().
     * setEntityFactory must be called before first use.
     *
     * @param blueprintname The name of the entity blueprint
     * @return A fully assembled Entity or null if the assembly failed.
     */
    public assembleEntity(blueprintname: string, overrides?: { [s: string]: { [s: string]: any } }) {
        if (this.entityFactory) {
            const entity = this.createEntity();
            if (this.entityFactory.assemble(entity, blueprintname, overrides)) {
                return entity;
            }
            entity.removeAll();
        }
        return null;
    }

    /**
     * Set the EntityFactory to use with assembleEntity.
     *
     * @param entityFactory The new EntityFactory
     */
    public setEntityFactory(entityFactory: EntityFactory) {
        this.entityFactory = entityFactory;
    }

    /**
     * Adds an entity to this Engine.
     *
     * @param entity the entity to add
     */
    public addEntity(entity: Entity) {
        if (((entity as any) as FriendlyEntity).uuid !== 0) throw new Error("Entity already added to an engine");
        ((entity as any) as FriendlyEntity).uuid = this.obtainEntityId();
        ((entity as any) as FriendlyEntity).engine = this;
        if (this.updating || this.notifying) this.entityOperationHandler.add(entity);
        else this.addEntityInternal(entity);
    }

    /**
     * Removes an entity from this Engine.
     *
     * @param entity the entity to remove
     */
    public removeEntity(entity: Entity) {
        if (this.updating || this.notifying) {
            if (((entity as any) as FriendlyEntity).scheduledForRemoval) return;

            ((entity as any) as FriendlyEntity).scheduledForRemoval = true;
            this.entityOperationHandler.remove(entity);
        } else {
            ((entity as any) as FriendlyEntity).scheduledForRemoval = true;
            this.removeEntityInternal(entity);
        }
    }

    /**
     * Removes all entities registered with this Engine.
     */
    public removeAllEntities() {
        if (this.updating || this.notifying) {
            for (const entity of this.entities) ((entity as any) as FriendlyEntity).scheduledForRemoval = true;

            this.entityOperationHandler.removeAll();
        } else {
            while (this.entities.length) {
                this.removeEntity(this.entities[0]);
            }
        }
    }

    /**
     * @param id The id of an Entity
     * @return The entity associated with the specified id or null if no such entity exists.
     */
    public getEntity(id: number) {
        return this.entitiesById[id] || null;
    }

    /** @return A list of all entities */
    public getEntities() {
        return this.entities;
    }

    /**
     * Adds the EntitySystem to this Engine.
     *
     * @typeparam T The entity system class
     * @param system The EntitySystem to add
     */
    public addSystem<T extends EntitySystem>(system: T) {
        const systemType = UniqueType.getForInstance(system);
        const systemTypeIndex = systemType.getIndex();

        this.removeSystemInternal(systemType);

        this.systems.push(system);
        this.systemsByType[systemTypeIndex] = system;
        ((system as any) as FriendlySystem).addedToEngine(this);

        this.sortSystems();
        return system;
    }

    /**
     * Removes the EntitySystem from this Engine.
     *
     * @param clazz The System class to remove
     */
    public removeSystem(clazz: Constructor<EntitySystem>) {
        this.removeSystemInternal(UniqueType.getForClass(clazz));
    }

    /**
     * Removes all systems registered with this Engine.
     */
    public removeAllSystems() {
        for (const system of this.systems) {
            ((system as any) as FriendlySystem).removedFromEngine(this);
        }
        this.systems = [];
        this.systemsByType = {};
    }

    /**
     * Sort all systems (usually done automatically, except if you override EntitySystem.getPriority())
     */
    public sortSystems() {
        this.systems.sort(compareSystems);
    }

    /**
     * Removes the EntitySystem from this Engine.
     *
     * @param type The EntitySystem type to remove
     */
    private removeSystemInternal(type: UniqueType) {
        const index = type.getIndex();
        const system = this.systemsByType[index];
        if (system) {
            delete this.systemsByType[index];

            const index2 = this.systems.indexOf(system);
            /* istanbul ignore else: this will never happen */
            if (index2 !== -1) this.systems.splice(index2, 1);
            ((system as any) as FriendlySystem).removedFromEngine(this);
        }
    }

    /**
     * Quick EntitySystem retrieval.
     *
     * @typeparam T The entity system class
     * @param clazz The EntitySystem class
     * @return The EntitySystem of the specified class, or null if no such system exists.
     */
    public getSystem<T extends EntitySystem>(clazz: Constructor<T>): T | null {
        const type = UniqueType.getForClass(clazz);
        const index = type.getIndex();
        return (this.systemsByType[index] as T) || null;
    }

    /**
     * @return A list of all entity systems managed by the Engine.
     */
    public getSystems() {
        return this.systems;
    }

    /**
     * @param family A Family instance
     * @return A list of entities for the specified Family. Will return the same instance every time.
     */
    public getEntitiesFor(family: Family) {
        return this.registerFamily(family);
    }

    /**
     * @param family A Family instance
     * @return The EntitySignal which emits when an entity is added to the specified Family
     */
    public getEntityAddedSignal(family: Family) {
        this.registerFamily(family);
        let signal = this.entityAddedSignals[family.index];
        if (!signal) {
            signal = new EntitySignal();
            this.entityAddedSignals[family.index] = signal;
        }
        return signal;
    }

    /**
     * @param family A Family instance
     * @return The EntitySignal which emits when an entity is removed from the specified Family
     */
    public getEntityRemovedSignal(family: Family) {
        this.registerFamily(family);
        let signal = this.entityRemovedSignals[family.index];
        if (!signal) {
            signal = new EntitySignal();
            this.entityRemovedSignals[family.index] = signal;
        }
        return signal;
    }

    /**
     * Updates all the systems in this Engine.
     *
     * @param deltaTime The time passed since the last frame.
     */
    public update(deltaTime: number) {
        this.updating = true;
        if (this.systems.length) {
            for (const system of this.systems) {
                if (system.checkProcessing()) system.update(deltaTime);

                this.processEntityFamilyUpdates();
                this.entityOperationHandler.process();
            }
        } else {
            this.processEntityFamilyUpdates();
            this.entityOperationHandler.process();
        }

        this.updating = false;
    }

    private obtainEntityId() {
        return this.nextEntityId++;
    }

    /**
     * Request the update of an entities family bits. For internal use.
     *
     * @param entity The entity to update
     */
    public requestFamilyUpdate(entity: Entity) {
        if (this.updating || this.notifying) this.entityFamilyUpdates.push(entity);
        else this.updateFamilyMembership(entity);
    }

    private processEntityFamilyUpdates() {
        let entity;
        // eslint-disable-next-line no-cond-assign
        while ((entity = this.entityFamilyUpdates.pop())) {
            this.updateFamilyMembership(entity);
        }
    }

    private updateFamilyMembership(entity: Entity) {
        if (((entity as any) as FriendlyEntity).scheduledForRemoval || !entity.isValid()) return;
        for (const key of Object.keys(this.entitiesByFamily)) {
            const family = Family.getByIndex(parseInt(key));
            /* istanbul ignore if: this will never happen */
            if (!family) continue;
            const familyEntities = this.entitiesByFamily[key];

            const belongsToFamily = entity.getFamilyBits().get(family.index);
            const matches = family.matches(entity);

            if (!belongsToFamily && matches) {
                familyEntities.push(entity);
                ((entity as any) as FriendlyEntity).familyBits.set(family.index);

                this.notifyFamilyListenersAdd(family, entity);
            } else if (belongsToFamily && !matches) {
                const index = familyEntities.indexOf(entity);
                /* istanbul ignore else: this will never happen */
                if (index !== -1) familyEntities.splice(index, 1);
                ((entity as any) as FriendlyEntity).familyBits.clear(family.index);

                this.notifyFamilyListenersRemove(family, entity);
            }
        }
    }

    private removeEntityInternal = (entity: Entity) => {
        // Check if entity is able to be removed (id === 0 means the entity has not been added to the engine yet)
        if (entity.getId() === 0) {
            entity.removeAll();
            return;
        }

        const index = this.entities.indexOf(entity);
        if (index === -1) throw new Error("Entity does not belong to this engine");
        this.entities.splice(index, 1);
        delete this.entitiesById[entity.getId()];

        if (!entity.getFamilyBits().isEmpty()) {
            for (const key of Object.keys(this.entitiesByFamily)) {
                const family = Family.getByIndex(parseInt(key));
                /* istanbul ignore if: this will never happen */
                if (!family) continue;
                const familyEntities = this.entitiesByFamily[key];

                if (family.matches(entity)) {
                    const index2 = familyEntities.indexOf(entity);
                    /* istanbul ignore else: this will never happen */
                    if (index2 !== -1) familyEntities.splice(index2, 1);

                    ((entity as any) as FriendlyEntity).familyBits.clear(family.index);
                    this.notifyFamilyListenersRemove(family, entity);
                }
            }
        }

        this.notifying = true;
        this.entityRemoved.emit(entity);
        this.notifying = false;

        entity.removeAll();
        ((entity as any) as FriendlyEntity).engine = this;
    };

    private removeAllEntitiesInternal = () => {
        const entities = this.getEntities();
        while (entities.length) {
            this.removeEntityInternal(entities[entities.length - 1]);
        }
    };

    private addEntityInternal = (entity: Entity) => {
        this.entities.push(entity);
        this.entitiesById[entity.getId()] = entity;

        this.updateFamilyMembership(entity);

        this.notifying = true;
        this.entityAdded.emit(entity);
        this.notifying = false;
    };

    private notifyFamilyListenersAdd(family: Family, entity: Entity) {
        const signal = this.entityAddedSignals[family.index];
        if (signal) {
            this.notifying = true;
            signal.emit(entity);
            this.notifying = false;
        }
    }

    private notifyFamilyListenersRemove(family: Family, entity: Entity) {
        const signal = this.entityRemovedSignals[family.index];
        if (signal) {
            this.notifying = true;
            signal.emit(entity);
            this.notifying = false;
        }
    }

    private registerFamily(family: Family) {
        let entities = this.entitiesByFamily[family.index];
        if (!entities) {
            entities = [];
            for (const e of this.entities) {
                if (family.matches(e)) {
                    entities.push(e);
                    ((e as unknown) as FriendlyEntity).familyBits.set(family.index);
                }
            }
            this.entitiesByFamily[family.index] = entities;
        }
        return entities;
    }
}
