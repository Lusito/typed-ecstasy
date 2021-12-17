import { AbstractSystem } from "./AbstractSystem";

/**
 * Base class for all normal systems. An EntitySystem is intended to process entities.
 *
 * @see {@link SubSystem} for systems to be used on a {@link SortedSubIteratingSystem}.
 */
export abstract class EntitySystem extends AbstractSystem<EntitySystem> {
    /**
     * The update method called every tick.
     *
     * @param deltaTime The time passed since last frame in seconds.
     */
    public abstract update(deltaTime: number): void;
}
