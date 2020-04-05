import { EntitySystem } from "../core/EntitySystem";
import { Family } from "../core/Family";
import { Entity } from "../core/Entity";
import { Engine } from "../core/Engine";

/**
 * A simple EntitySystem that iterates over each entity and calls processEntity() for each entity every time the
 * EntitySystem is updated. This is really just a convenience class as most systems iterate over a list of entities.
 */
export abstract class IteratingSystem extends EntitySystem {
    private readonly family: Family;

    private entities: Entity[] = [];

    /**
     * @param family The family of entities iterated over in this System
     * @param priority The priority to execute this system with (lower means higher priority).
     */
    public constructor(family: Family, priority = 0) {
        super(priority);
        this.family = family;
    }

    public update(deltaTime: number) {
        for (const entity of this.entities) this.processEntity(entity, deltaTime);
    }

    protected addedToEngine(engine: Engine) {
        super.addedToEngine(engine);
        this.entities = engine.getEntitiesFor(this.family);
    }

    protected removedFromEngine(engine: Engine) {
        super.removedFromEngine(engine);
        this.entities = [];
    }

    /** @return A list of entities processed by the system */
    public getEntities() {
        return this.entities;
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
