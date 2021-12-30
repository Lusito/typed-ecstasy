import type { Engine } from "../core/Engine";
import type { Entity } from "../core/Entity";
import { EntitySystem } from "../core/EntitySystem";
import type { Family } from "../core/Family";

/**
 * A simple EntitySystem that iterates over each entity and calls {@link processEntity} for each entity every time the
 * EntitySystem is updated. This is really just a convenience class as most systems iterate over a list of entities.
 */
export abstract class IteratingSystem extends EntitySystem {
    /** The Family used when the system was created. */
    public readonly family: Family;

    /** The list of entities processed by the system. */
    public readonly entities: readonly Entity[];

    /**
     * @param engine The engine to use.
     * @param family The family of entities iterated over in this System.
     */
    public constructor(engine: Engine, family: Family) {
        super(engine);
        this.family = family;
        this.entities = this.engine.entities.forFamily(this.family);
    }

    public override update(deltaTime: number) {
        for (const entity of this.entities) this.processEntity(entity, deltaTime);
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
