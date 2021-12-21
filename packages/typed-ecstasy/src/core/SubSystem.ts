import { AbstractSystem } from "./AbstractSystem";
import type { Engine } from "./Engine";
import type { Entity } from "./Entity";
import type { Family } from "./Family";
import type { SubSystemManager } from "./SubSystemManager";

/**
 * Base class for sub-systems to be used with {@link SortedSubIteratingSystem}.
 */
export abstract class SubSystem extends AbstractSystem<SubSystem, SubSystemManager> {
    private desiredEnabled = false;
    public readonly family: Family;

    /**
     * @param engine The engine to use.
     * @param family The family of entities to process.
     */
    public constructor(engine: Engine, family: Family) {
        super(engine);
        this.family = family;
    }

    public override setEnabled(enabled: boolean) {
        this.desiredEnabled = enabled;
        // eslint-disable-next-line dot-notation
        super.setEnabled(enabled && this["manager"]?.["isEnabled"]() !== false);
    }

    /**
     * Updates the enabled state.
     *
     * @internal
     */
    public updateEnabled() {
        this.setEnabled(this.desiredEnabled);
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
