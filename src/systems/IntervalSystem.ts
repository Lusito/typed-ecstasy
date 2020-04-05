import { EntitySystem } from "../core/EntitySystem";

/**
 * A simple EntitySystem that does not run its update logic every call to update(float), but after a
 * given interval. The actual logic should be placed in updateInterval().
 */
export abstract class IntervalSystem extends EntitySystem {
    private readonly interval: number;

    private accumulator = 0;

    /**
     * @param interval time in seconds between calls to updateInterval().
     * @param priority The priority to execute this system with (lower means higher priority).
     */
    public constructor(interval: number, priority = 0) {
        super(priority);
        this.interval = interval;
    }

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

    /**
     * The processing logic of the system should be placed here.
     */
    protected abstract updateInterval(): void;
}
