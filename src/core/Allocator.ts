import { Component, NoArgsComponentConstructor } from "./Component";
import { Entity } from "./Entity";

/**
 * An allocator can be used for obtaining new or reused entities/components.
 * This allocator just creates new instances every time and does not support pooling.
 *
 * @see {@link PoolAllocator}
 */
export class Allocator {
    /** @returns A new or reused entity. */
    public obtainEntity(): Entity {
        return new Entity();
    }

    /**
     * Free an entity (possibly marking it for reuse).
     *
     * @param _entity The entity to free.
     */
    public freeEntity(_entity: Entity) {
        // override this
    }

    /**
     * @template T The component class to obtain, do not specify manually!
     * @param Class The component constructor to use.
     * @returns A new or reused component of the specified class.
     */
    public obtainComponent<T extends Component>(Class: NoArgsComponentConstructor<T>) {
        return new Class();
    }

    /**
     * Free a component (possibly marking it for reuse).
     *
     * @param _component The component to free.
     */
    public freeComponent(_component: Component) {
        // override this
    }
}
