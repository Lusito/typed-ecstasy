import type { Allocator } from "../core/Allocator";
import { Entity } from "../core/Entity";

/**
 * An entity, which can be pooled. Do not use manually!
 *
 * @see {@link PoolAllocator}
 * @internal
 */
export class PooledEntity extends Entity {
    private readonly allocator: Allocator;

    /** @param allocator The allocator to use when freeing components. */
    public constructor(allocator: Allocator) {
        super();
        this.allocator = allocator;
    }

    protected override removeInternal(id: number) {
        const removed = super.removeInternal(id);
        if (removed) this.allocator.freeComponent(removed);

        return removed;
    }

    protected override removeAllInternal() {
        for (const component of this.getAll()) {
            if (component) this.allocator.freeComponent(component);
        }

        super.removeAllInternal();
    }

    /**
     * Reset the entity when it gets added to a pool.
     */
    public reset() {
        this.removeAllInternal();
        this.familyMeta.clear();
        this.manager = null;
        this.uuid = 0;
        for (const key of Object.keys(this.meta)) {
            delete (this.meta as Record<string, unknown>)[key];
        }
        this.scheduledForRemoval = false;
    }
}
