import { retainable } from "../di";
import type { Engine } from "../core/Engine";
import { EntitySystem } from "../core/EntitySystem";

/**
 * A simple EntitySystem that does not run its update logic every call to {@link update}, but after a
 * given interval. The actual logic should be placed in {@link updateInterval}.
 */
export abstract class IntervalSystem extends EntitySystem {
    private interval: number;

    @retainable
    private accumulator = 0;

    /**
     * @param engine The engine to use.
     * @param interval The time in seconds between calls to {@link updateInterval}.
     */
    public constructor(engine: Engine, interval: number) {
        super(engine);
        this.interval = interval;
    }

    /**
     * Update the interval.
     *
     * @param interval The time in seconds between calls to {@link updateInterval}.
     */
    public setInterval(interval: number) {
        this.interval = interval;
    }

    /**
     * @returns The time in seconds between calls to {@link updateInterval}.
     */
    public getInterval() {
        return this.interval;
    }

    public override update(deltaTime: number) {
        this.accumulator += deltaTime;

        while (this.accumulator >= this.interval) {
            this.accumulator -= this.interval;
            this.updateInterval();
        }
    }

    /**
     * The processing logic of the system should be placed here.
     * Will be called once every defined interval.
     */
    protected abstract updateInterval(): void;
}
