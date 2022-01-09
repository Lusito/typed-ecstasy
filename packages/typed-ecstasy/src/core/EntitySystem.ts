import { AbstractSystem } from "./AbstractSystem";
import type { EntitySystemManager } from "./EntitySystemManager";

/**
 * Base class for all normal systems. An EntitySystem is intended to process entities.
 *
 * @see {@link SubSystem} for systems to be used on a {@link SortedSubIteratingSystem}.
 */
export abstract class EntitySystem extends AbstractSystem<EntitySystem, EntitySystemManager> {
    /**
     * The update method called every tick.
     *
     * @param deltaTime The time passed since last frame in seconds.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public update(deltaTime: number): void {
        // do nothing by default
    }
}
