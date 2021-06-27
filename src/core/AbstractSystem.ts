import { Inject } from "typedi";

import { Engine } from "./Engine";
import { AbstractSystemManager } from "./AbstractSystemManager";

/**
 * Base class for all systems.
 *
 * @template TSystem The base system class (EntitySystem or SubSystem).
 */
export abstract class AbstractSystem<TSystem extends AbstractSystem<any>> {
    /** The engine of this system. */
    @Inject()
    public readonly engine!: Engine;

    private manager: AbstractSystemManager<TSystem> | null = null;

    private enabled = true;

    private priority = 0;

    /**
     * Called when this system is added to the manager or re-enabled after being disabled.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onEnable() {}

    /**
     * Called when this system is removed from the manager or being disabled.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onDisable() {}

    /**
     * Enable or disable the system. A disabled system will not be processed during an update.
     *
     * @param enabled The new state.
     */
    public setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    /**
     * @returns True if the system is enabled.
     */
    public isEnabled() {
        return this.enabled;
    }

    /**
     * Set the system priority. You can set the priority with when adding the system as well.
     *
     * @param priority The priority to execute this system with (lower means higher priority).
     */
    public setPriority(priority: number) {
        this.priority = priority;
        // eslint-disable-next-line dot-notation
        this.manager?.["delayedOperations"].sort();
    }

    /**
     * @returns The priority of the system. Do not override this!
     */
    public getPriority() {
        return this.priority;
    }
}

/**
 * An interface for a constructor of a system.
 *
 * @template TSystem The system class the constructor creates.
 */
export interface SystemConstructor<TSystem extends AbstractSystem<any>> {
    /** The name of the constructor. */
    name?: string;
    /** The constructor function. */
    new (...p: any[]): TSystem;
}
