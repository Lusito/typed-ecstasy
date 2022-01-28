import { Allocator } from "../core/Allocator";
import type { Component, ComponentBuilder, ComponentClass } from "../core/Component";
import type { Entity } from "../core/Entity";
import { Pool } from "./Pool";
import { PooledEntity } from "./PooledEntity";

/**
 * A configuration object for the pool allocator.
 */
export interface PoolAllocatorConfig {
    /** The maximum number of free entities to store. */
    maxEntities?: number;
    /** The default maximum number of free components per type to store. */
    maxComponentsDefault?: number;
    /** The maximum number of free components per type to store. */
    maxComponentPerType?: Array<[id: number, max: number]>;
}

/**
 * An allocator, which implements object pooling for entities and components.
 */
export class PoolAllocator extends Allocator {
    private readonly entityPool: Pool<PooledEntity>;
    private readonly componentPools: Array<Pool<Component>> = [];
    private readonly maxComponentsDefault?: number;
    private readonly maxComponentPerType: number[] = [];

    /**
     * Create a new pool allocator.
     *
     * @param config The configuration to use.
     */
    public constructor(config?: PoolAllocatorConfig) {
        super();
        this.entityPool = new Pool(config?.maxEntities);
        this.maxComponentsDefault = config?.maxComponentsDefault;

        const overrides = config?.maxComponentPerType ?? [];
        for (const [id, max] of overrides) {
            this.maxComponentPerType[id] = max;
        }
    }

    public override obtainEntity(): Entity {
        return this.entityPool.obtain() ?? new PooledEntity(this);
    }

    public override freeEntity(entity: Entity) {
        if (entity instanceof PooledEntity) {
            this.entityPool.free(entity);
            entity.reset();
        }
    }

    public override obtainComponent<T extends Component>(
        Class: ComponentClass<any, T>,
        builder: ComponentBuilder<T, unknown>
    ): T {
        const pool = this.componentPools[Class.id];
        if (pool) {
            const comp = pool.obtain();
            if (comp) return comp as T;
        }
        return super.obtainComponent(Class, builder);
    }

    public override freeComponent(component: Component) {
        const { id } = component.constructor as ComponentClass;
        let pool = this.componentPools[id];
        if (!pool) {
            pool = new Pool(this.maxComponentPerType[id] ?? this.maxComponentsDefault);
            this.componentPools[id] = pool;
        }
        pool.free(component);
        // eslint-disable-next-line dot-notation
        (component["componentBuilder"] as ComponentBuilder<unknown, unknown>).reset?.(component);
    }

    protected override onComponentMetaDataChange(Class: ComponentClass<any, any>) {
        const pool = this.componentPools[Class.id];
        if (pool) {
            // We need to change all components to use the new class
            for (const comp of pool.freeObjects) {
                Object.setPrototypeOf(comp, Class.prototype);
            }
        }
    }
}
