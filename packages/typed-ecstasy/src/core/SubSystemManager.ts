import { service } from "../di";
import { AbstractSystemManager } from "./AbstractSystemManager";
import { SubSystem } from "./SubSystem";

/**
 * A manager for sub systems to be used with {@link SortedSubIteratingSystem}.
 */
@service("typed-ecstasy/SubSystemManager", { transient: true })
export class SubSystemManager extends AbstractSystemManager<SubSystem> {
    /**
     * @internal
     * @returns If the SortedSubIteratingSystem this manager belongs to is enabled.
     */
    public isEnabled() {
        return false;
    }

    /**
     * Updates the enabled state of all subsystems.
     *
     * @internal
     */
    public updateEnabled() {
        for (const system of this.getAll()) {
            system.updateEnabled();
        }
    }
}
