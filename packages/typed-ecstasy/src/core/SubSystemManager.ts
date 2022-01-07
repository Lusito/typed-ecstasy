import { Container, service } from "../di";
import { AbstractSystemManager } from "./AbstractSystemManager";
import type { SubSystem } from "./SubSystem";

/**
 * A manager for sub systems to be used with {@link SortedSubIteratingSystem}.
 */
@service({ transient: true })
export class SubSystemManager extends AbstractSystemManager<SubSystem> {
    /** @param container The parent container. */
    public constructor(container: Container) {
        super(new Container(container));
    }

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
