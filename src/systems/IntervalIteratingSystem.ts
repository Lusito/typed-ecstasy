import { Entity } from "../core/Entity";
import { Family } from "../core/Family";
import { IntervalSystem } from "./IntervalSystem";

/**
 * A simple EntitySystem that processes a {@link Family} of entities not once per frame, but after a given interval.
 * Entity processing logic should be placed in {@link processEntity}.
 */
export abstract class IntervalIteratingSystem extends IntervalSystem {
    /** The Family used when the system was created. */
    public readonly family: Family;

    private entities: Entity[] = [];

    /**
     * @param family Represents the collection of family the system should process.
     * @param interval The time in seconds between calls to {@link updateInterval}.
     */
    public constructor(family: Family, interval: number) {
        super(interval);
        this.family = family;
    }

    protected override onEnable() {
        this.entities = this.engine.entities.forFamily(this.family);
    }

    protected override onDisable() {
        this.entities = [];
    }

    protected override updateInterval() {
        for (const entity of this.entities) {
            this.processEntity(entity);
        }
    }

    /**
     * @returns A list of entities processed by the system.
     */
    public getEntities() {
        return this.entities;
    }

    /**
     * The user should place the entity processing logic here.
     *
     * @param entity The entity to be processed.
     */
    protected abstract processEntity(entity: Entity): void;
}
