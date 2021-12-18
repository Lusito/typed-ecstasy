import { Engine } from "./Engine";
import { AbstractSystemManager } from "./AbstractSystemManager";
import { addMetaData, retainable, setHotSwapListener } from "../di";

/**
 * Base class for all systems.
 *
 * @template TSystem The base system class (EntitySystem or SubSystem).
 */
@addMetaData
export abstract class AbstractSystem<TSystem extends AbstractSystem<any>> {
    public readonly engine: Engine;

    @retainable
    private manager: AbstractSystemManager<TSystem> | null = null;

    private enabled = false; // will be set to true during systems.add

    @retainable
    private priority = 0;

    /**
     * @param engine The engine to use.
     */
    public constructor(engine: Engine) {
        this.engine = engine;
    }

    /**
     * Called in two situations:
     * - When the system is enabled **and** currently being added to the manager
     * - When the system is already added to the manager **and** is currently being enabled.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onEnable() {}

    /**
     * Called in two situations:
     * - When the system is enabled **and** currently being removed from the manager
     * - When the system is already added to the manager **and** is currently being disabled.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected onDisable() {}

    /**
     * Enable or disable the system. A disabled system will not be processed during an update.
     *
     * @param enabled The new state.
     */
    public setEnabled(enabled: boolean) {
        if (this.enabled !== enabled) {
            this.enabled = enabled;

            if (this.manager) {
                if (enabled) this.onEnable();
                else this.onDisable();
            }
        }
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

setHotSwapListener<boolean>({
    beforeHotSwap(target) {
        if (target instanceof AbstractSystem) {
            const enabled = target.isEnabled();
            target.setEnabled(false);
            return enabled;
        }
        return false;
    },
    afterHotSwap(target, enabled) {
        if (target instanceof AbstractSystem) {
            target.setEnabled(enabled);
        }
    },
});
