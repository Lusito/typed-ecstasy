import { AbstractSystem } from "../core/AbstractSystem";
import { Entity } from "../core/Entity";
import { Family } from "../core/Family";

/**
 * Base class for sub-systems to be used with {@link SortedSubIteratingSystem}.
 */
export abstract class SubSystem extends AbstractSystem<SubSystem> {
    public readonly family: Family;

    /**
     * @param family The family of entities to process.
     */
    public constructor(family: Family) {
        super();
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
