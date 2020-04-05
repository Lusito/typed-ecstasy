import { SignalConnections } from "typed-signals";

import { EntitySystem } from "../core/EntitySystem";
import { Family } from "../core/Family";
import { Entity } from "../core/Entity";
import { Engine } from "../core/Engine";

/**
 * A comparator for entities.
 *
 * @see Array.sort()
 */
export type EntityComparator = (a: Entity, b: Entity) => number;

/**
 * Like IteratingSystem, but sorted using a comparator.
 * It processes each Entity of a given Family in the order specified by a comparator and
 * calls processEntity() for each Entity every time the EntitySystem is updated. This is really just a convenience
 * class as rendering systems tend to iterate over a list of entities in a sorted manner. Adding entities will cause
 * the entity list to be resorted. Call forceSort() if you changed your sorting criteria.
 */
export abstract class SortedIteratingSystem extends EntitySystem {
    private family: Family;

    private sortedEntities: Entity[] = [];

    private shouldSort = false;

    private comparator: EntityComparator;

    private connections = new SignalConnections();

    /**
     * @param family The family of entities iterated over in this System
     * @param comparator The comparator to sort the entities
     * @param priority The priority to execute this system with (lower means higher priority).
     */
    public constructor(family: Family, comparator: EntityComparator, priority = 0) {
        super(priority);
        this.family = family;
        this.comparator = comparator;
    }

    /**
     * Call this if the sorting criteria have changed.
     * The actual sorting will be delayed until the entities are processed.
     */
    public forceSort() {
        this.shouldSort = true;
    }

    private sort() {
        if (this.shouldSort) {
            this.sortedEntities.sort(this.comparator);
            this.shouldSort = false;
        }
    }

    private entityAdded = (entity: Entity) => {
        this.sortedEntities.push(entity);
        this.shouldSort = true;
    }

    private entityRemoved = (entity: Entity) => {
        const index = this.sortedEntities.indexOf(entity);
        if (index !== -1) {
            this.sortedEntities.splice(index, 1);
            this.shouldSort = true;
        }
    }

    protected addedToEngine(engine: Engine) {
        super.addedToEngine(engine);
        const newEntities = engine.getEntitiesFor(this.family);
        this.sortedEntities = [];
        if (newEntities.length) {
            for (const entity of newEntities) {
                this.sortedEntities.push(entity);
            }
            this.sortedEntities.sort(this.comparator);
        }
        this.shouldSort = false;
        this.connections.add(engine.getEntityAddedSignal(this.family).connect(this.entityAdded));
        this.connections.add(engine.getEntityRemovedSignal(this.family).connect(this.entityRemoved));
    }

    protected removedFromEngine(engine: Engine) {
        super.removedFromEngine(engine);
        this.connections.disconnectAll();
        this.sortedEntities = [];
        this.shouldSort = false;
    }

    public update(deltaTime: number) {
        this.sort();
        for (const entity of this.sortedEntities) {
            this.processEntity(entity, deltaTime);
        }
    }

    /**
     * @return The set of entities processed by the system
     */
    public getEntities() {
        this.sort();
        return this.sortedEntities;
    }

    /** @return The Family used when the system was created */
    public getFamily() {
        return this.family;
    }

    /**
     * This method is called on every entity on every update call of the EntitySystem.
     * Override this to implement your system's specific processing.
     *
     * @param entity The current Entity being processed
     * @param deltaTime The delta time between the last and current frame
     */
    protected abstract processEntity(entity: Entity, deltaTime: number): void;
}
