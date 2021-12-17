import { AbstractSystem } from "./AbstractSystem";
import { Engine } from "./Engine";
import { Entity } from "./Entity";
import { Family } from "./Family";

/**
 * Base class for sub-systems to be used with {@link SortedSubIteratingSystem}.
 */
export abstract class SubSystem extends AbstractSystem<SubSystem> {
    public readonly family: Family;

    /**
     * @param engine The engine to use.
     * @param family The family of entities to process.
     */
    public constructor(engine: Engine, family: Family) {
        super(engine);
        this.family = family;
    }

    /**
     * This method is called on every entity on every update call of the SubSystem.
     * Override this to implement your system's specific processing.
     *
     * @param entity The current Entity being processed.
     * @param deltaTime The delta time between the last and current frame.
     */
    public abstract processEntity(entity: Entity, deltaTime: number): void;
}
