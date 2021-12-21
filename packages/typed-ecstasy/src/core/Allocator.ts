import type { ComponentBuilder, ComponentData, ComponentType } from "./Component";
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
     * @param _entity The entity to free.
     */
    public freeEntity(_entity: Entity) {
        // override this
    }

    /**
     * @template T The component data type, do not specify manually!
     * @param type The component type to get.
     * @param factory The factory to use.
     * @returns A new or reused component of the specified type.
     */
    public obtainComponent<T>(
        type: ComponentType<string, T, unknown>,
        factory: ComponentBuilder<T, unknown>
    ): ComponentData<T> {
        const comp = {
            componentId: type.id,
            componentName: type.name,
            componentFactory: factory,
        } as ComponentData<T>;
        factory.reset?.(comp);
        return comp;
    }

    /**
     * Free a component (possibly marking it for reuse).
     *
     * @param component The component data to free.
     */
    public freeComponent(component: ComponentData<unknown>) {
        component.componentFactory.reset?.(component);
        // override this
    }
}
