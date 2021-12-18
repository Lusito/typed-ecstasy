import { SignalConnections } from "typed-signals";

import { EntitySystem } from "../core/EntitySystem";
import { Engine } from "../core/Engine";
import { addMetaData, retainable } from "../di";
import { Entity } from "../core/Entity";
import { Family } from "../core/Family";

/**
 * A comparator for entities.
 *
 * @see Array.sort()
 */
export type EntityComparator = (a: Entity, b: Entity) => number;

/**
 * Like {@link IteratingSystem}, but sorted using a comparator.
 * It processes each Entity of a given {@link Family} in the order specified by a comparator and
 * calls {@link processEntity} for each Entity every time the EntitySystem is updated. This is really just a convenience
 * class as rendering systems tend to iterate over a list of entities in a sorted manner. Adding entities will cause
 * the entity list to be resorted. Call {@link forceSort} if you changed your sorting criteria.
 */
@addMetaData
export abstract class SortedIteratingSystem extends EntitySystem {
    /** The Family used when the system was created. */
    public readonly family: Family;

    private entities: Entity[] = [];

    private shouldSort = false;

    @retainable
    private comparator: EntityComparator;

    private readonly connections = new SignalConnections();

    /**
     * @param engine The engine to use.
     * @param family The family of entities iterated over in this system.
     * @param comparator The comparator to sort the entities.
     */
    public constructor(engine: Engine, family: Family, comparator: EntityComparator) {
        super(engine);
        this.family = family;
        this.comparator = comparator;
    }

    /**
     * Update the comparator to sort the entities. Implicitly calls {@link forceSort}.
     *
     * @param comparator The comparator to sort the entities.
     */
    public setComparator(comparator: EntityComparator) {
        this.comparator = comparator;
        this.forceSort();
    }

    /**
     * Call this if the sorting criteria have changed.
     * The actual sorting will be delayed until the entities are processed.
     */
    public forceSort() {
        this.shouldSort = true;
    }

    /** Sorts the entities if needed. */
    private sort() {
        if (this.shouldSort) {
            this.entities.sort(this.comparator);
            this.shouldSort = false;
        }
    }

    private entityAdded = (entity: Entity) => {
        this.entities.push(entity);
        this.shouldSort = true;
    };

    private entityRemoved = (entity: Entity) => {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
            this.shouldSort = true;
        }
    };

    protected override onEnable() {
        this.entities = this.engine.entities.forFamily(this.family).slice().sort(this.comparator);
        this.connections.add(this.engine.entities.onAddForFamily(this.family).connect(this.entityAdded));
        this.connections.add(this.engine.entities.onRemoveForFamily(this.family).connect(this.entityRemoved));
    }

    protected override onDisable() {
        this.connections.disconnectAll();
        this.entities = [];
        this.shouldSort = false;
    }

    public override update(deltaTime: number) {
        this.sort();
        for (const entity of this.entities) {
            this.processEntity(entity, deltaTime);
        }
    }

    /**
     * @returns The set of entities processed by the system.
     */
    public getEntities() {
        this.sort();
        return this.entities;
    }

    /**
     * This method is called on every entity on every update call of the EntitySystem.
     * Override this to implement your system's specific processing.
     *
     * @param entity The current Entity being processed.
     * @param deltaTime The delta time between the last and current frame.
     */
    protected abstract processEntity(entity: Entity, deltaTime: number): void;
}
