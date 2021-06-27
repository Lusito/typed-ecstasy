import { Component, NoArgsComponentConstructor } from "../core/Component";
import { Entity } from "../core/Entity";
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
    maxComponentPerType?: Array<[clazz: NoArgsComponentConstructor, max: number]>;
}

/**
 * An allocator, which implements object pooling for entities and components.
 */
export class PoolAllocator {
    private readonly entityPool: Pool<PooledEntity>;
    private readonly componentPools: Map<NoArgsComponentConstructor, Pool<any>>;
    private readonly maxComponentsDefault?: number;

    /**
     * Create a new pool allocator.
     *
     * @param config The configuration to use.
     */
    public constructor(config?: PoolAllocatorConfig) {
        this.entityPool = new Pool(() => new PooledEntity(this), config?.maxEntities);
        this.maxComponentsDefault = config?.maxComponentsDefault;

        // Create the component pools we already know about
        const overrides = config?.maxComponentPerType ?? [];
        this.componentPools = new Map(overrides.map(([Class, cfg]) => [Class, new Pool<any>(() => new Class(), cfg)]));
    }

    /** @returns A new or reused entity. */
    public obtainEntity(): Entity {
        return this.entityPool.obtain();
    }

    /**
     * Free an entity.
     *
     * @param entity The entity to free.
     */
    public freeEntity(entity: Entity) {
        if (entity instanceof PooledEntity) this.entityPool.free(entity);
    }

    /**
     * @template T The type of component, do not specify manually!
     * @param Class The constructor of the component.
     * @returns A new or reused component.
     */
    public obtainComponent<T extends Component>(Class: NoArgsComponentConstructor<T>): T {
        let pool = this.componentPools.get(Class);
        if (!pool) {
            pool = new Pool<any>(() => new Class(), this.maxComponentsDefault);
            this.componentPools.set(Class, pool);
        }
        return pool.obtain();
    }

    /**
     * Free a component.
     *
     * @param component The component to free.
     */
    public freeComponent(component: Component) {
        this.componentPools.get(component.getComponentClass())?.free(component);
    }
}
