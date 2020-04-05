import type { Engine } from "./Engine";

/**
 * Base class for all systems. An EntitySystem is intended to process entities.
 */
export abstract class EntitySystem {
    private processing = true;

    private engine: Engine | null = null;

    private priority: number;

    /**
     * @param priority The priority to execute this system with (lower means higher priority).
     */
    public constructor(priority = 0) {
        this.priority = priority;
    }

    /**
     * The update method called every tick.
     *
     * @param deltaTime The time passed since last frame in seconds.
     */
    public abstract update(deltaTime: number): void;

    /** @return Whether or not the system should be processed. */
    public checkProcessing() {
        return this.processing;
    }

    /**
     * Sets whether or not the system should be processed by the Engine.
     *
     * @param processing true to enable, false to disable processing
     */
    public setProcessing(processing: boolean) {
        this.processing = processing;
    }

    /** @return The priority of the system */
    public getPriority() {
        return this.priority;
    }

    /**
     * Use this to set the priority of the system. Lower means it'll get executed first.
     *
     * @param priority the new priority
     */
    public setPriority(priority: number) {
        this.priority = priority;
        if (this.engine) this.engine.sortSystems();
    }

    /** @return The engine */
    public getEngine() {
        return this.engine;
    }

    /**
     * Called when this EntitySystem is added to an Engine.
     *
     * @param engine The Engine this system was added to.
     */
    protected addedToEngine(engine: Engine) {
        this.engine = engine;
    }

    /**
     * Called when this EntitySystem is removed from an Engine.
     *
     * @param _engine The Engine the system was removed from.
     */
    protected removedFromEngine(_engine: Engine) {
        this.engine = null;
    }
}
