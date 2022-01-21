import { Component, ComponentBuilder, ComponentClass } from "./Component";
import { Entity } from "./Entity";

// fixme: utils?
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
     * @param entity The entity to free.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public freeEntity(entity: Entity) {
        // override this
    }

    /**
     * @template T The component data type, do not specify manually!
     * @param Class The component type to get.
     * @param builder The builder to use.
     * @returns A new or reused component of the specified type.
     */
    public obtainComponent<T extends Component>(
        Class: ComponentClass<any, T>,
        builder: ComponentBuilder<T, unknown>
    ): T {
        const comp = new Class();
        // eslint-disable-next-line dot-notation
        (comp["componentBuilder"] as ComponentBuilder<unknown, unknown>) = builder;
        builder.reset?.(comp);
        return comp;
    }

    /**
     * Free a component (possibly marking it for reuse).
     *
     * @param component The component data to free.
     */
    public freeComponent(component: Component) {
        // override this
        // eslint-disable-next-line dot-notation
        (component["componentBuilder"] as ComponentBuilder<unknown, unknown>).reset?.(component);
    }
}
