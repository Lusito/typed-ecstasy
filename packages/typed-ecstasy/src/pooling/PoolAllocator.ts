import { Allocator } from "../core/Allocator";
import type { ComponentBuilder, ComponentBuilderWithConfig, ComponentData, ComponentType } from "../core/Component";
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
    maxComponentPerType?: Array<[type: ComponentType<string, unknown>, max: number]>;
}

/**
 * An allocator, which implements object pooling for entities and components.
 */
export class PoolAllocator extends Allocator {
    private readonly entityPool: Pool<PooledEntity>;
    private readonly componentPools: Array<Pool<ComponentData<unknown>>> = [];
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
        for (const [type, max] of overrides) {
            this.maxComponentPerType[type.id] = max;
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

    public override obtainComponent<T>(
        type: ComponentType<string, T>,
        factory: ComponentBuilder<T> | ComponentBuilderWithConfig<T, unknown>
    ): ComponentData<T> {
        const pool = this.componentPools[type.id];
        if (pool) {
            const comp = pool.obtain();
            if (comp) return comp as ComponentData<T>;
        }
        return super.obtainComponent(type, factory);
    }

    public override freeComponent<T>(component: ComponentData<T>) {
        let pool = this.componentPools[component.componentId];
        if (!pool) {
            pool = new Pool(this.maxComponentPerType[component.componentId] ?? this.maxComponentsDefault);
            this.componentPools[component.componentId] = pool;
        }
        pool.free(component);
        component.componentFactory.reset?.(component);
    }
}
