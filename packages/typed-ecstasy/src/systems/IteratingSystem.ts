import { EntitySystem } from "../core/EntitySystem";
import { Family } from "../core/Family";
import { Entity } from "../core/Entity";

/**
 * A simple EntitySystem that iterates over each entity and calls {@link processEntity} for each entity every time the
 * EntitySystem is updated. This is really just a convenience class as most systems iterate over a list of entities.
 */
export abstract class IteratingSystem extends EntitySystem {
    /** The Family used when the system was created. */
    public readonly family: Family;

    private entities: Entity[] = [];

    /**
     * @param family The family of entities iterated over in this System.
     */
    public constructor(family: Family) {
        super();
        this.family = family;
    }

    protected override onEnable() {
        this.entities = this.engine.entities.forFamily(this.family);
    }

    protected override onDisable() {
        this.entities = [];
    }

    public override update(deltaTime: number) {
        for (const entity of this.entities) this.processEntity(entity, deltaTime);
    }

    /** @returns A list of entities processed by the system. */
    public getEntities() {
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
