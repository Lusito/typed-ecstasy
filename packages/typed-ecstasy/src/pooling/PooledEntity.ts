import { Allocator } from "../core/Allocator";
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

        return super.removeAllInternal();
    }

    public reset() {
        this.removeAllInternal();
        this.manager = null;
        this.uuid = 0;
        this.flags = 0;
        this.scheduledForRemoval = false;
    }
}
