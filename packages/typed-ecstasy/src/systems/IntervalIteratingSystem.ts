import type { Engine } from "../core/Engine";
import type { Entity } from "../core/Entity";
import type { Family } from "../core/Family";
import { IntervalSystem } from "./IntervalSystem";

/**
 * A simple EntitySystem that processes a {@link Family} of entities not once per frame, but after a given interval.
 * Entity processing logic should be placed in {@link processEntity}.
 */
export abstract class IntervalIteratingSystem extends IntervalSystem {
    /** The Family used when the system was created. */
    public readonly family: Family;

    /** The list of entities processed by the system. */
    public readonly entities: readonly Entity[] = [];

    /**
     * @param engine The engine to use.
     * @param family Represents the collection of family the system should process.
     * @param interval The time in seconds between calls to {@link updateInterval}.
     */
    public constructor(engine: Engine, family: Family, interval: number) {
        super(engine, interval);
        this.family = family;
        this.entities = this.engine.entities.forFamily(this.family);
    }

    protected override updateInterval() {
        for (const entity of this.entities) {
            this.processEntity(entity);
        }
    }

    /**
     * The user should place the entity processing logic here.
     *
     * @param entity The entity to be processed.
     */
    protected abstract processEntity(entity: Entity): void;
}
