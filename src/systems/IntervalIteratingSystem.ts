import { Entity } from "../core/Entity";
import { Engine } from "../core/Engine";
import { Family } from "../core/Family";
import { EntitySystem } from "../core/EntitySystem";

/**
 * A simple EntitySystem that processes a Family of entities not once per frame, but after a given interval.
 * Entity processing logic should be placed in processEntity().
 */
export abstract class IntervalIteratingSystem extends EntitySystem {
    private readonly family: Family;

    private entities: Entity[] = [];

    private readonly interval: number;

    private accumulator = 0;

    /**
     * @param family Represents the collection of family the system should process
     * @param interval time in seconds between calls to updateInterval().
     * @param priority The priority to execute this system with (lower means higher priority).
     */
    public constructor(family: Family, interval: number, priority = 0) {
        super(priority);
        this.family = family;
        this.interval = interval;
    }

    protected addedToEngine(engine: Engine) {
        super.addedToEngine(engine);
        this.entities = engine.getEntitiesFor(this.family);
    }

    protected removedFromEngine(engine: Engine) {
        super.removedFromEngine(engine);
        this.entities = [];
    }

    /**
     * The processing logic of the system should be placed here.
     */
    protected updateInterval() {
        for (const entity of this.entities) {
            this.processEntity(entity);
        }
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
     * The user should place the entity processing logic here.
     *
     * @param entity The entity to be processed
     */
    protected abstract processEntity(entity: Entity): void;

    /** @return time in seconds between calls to updateInterval(). */
    public getInterval() {
        return this.interval;
    }

    public update(deltaTime: number) {
        this.accumulator += deltaTime;

        while (this.accumulator >= this.interval) {
            this.accumulator -= this.interval;
            this.updateInterval();
        }
    }
}
