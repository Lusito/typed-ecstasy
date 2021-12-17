import { Allocator } from "../core/Allocator";
import { ComponentConstructor } from "../core/Component";
import { Entity } from "../core/Entity";
import { Poolable } from "./Pool";

/**
 * An entity, which can be pooled. Do not use manually!
 *
 * @see {@link PoolAllocator}
 * @internal
 */
export class PooledEntity extends Entity implements Poolable {
    private readonly allocator: Allocator;

    /** @param allocator The allocator to use when freeing components. */
    public constructor(allocator: Allocator) {
        super();
        this.allocator = allocator;
    }

    protected override removeInternal(clazz: ComponentConstructor) {
        const removed = super.removeInternal(clazz);
        if (removed) this.allocator.freeComponent(removed);

        return removed;
    }

    protected override removeAllInternal() {
        for (const component of this.getAll()) {
            this.allocator.freeComponent(component);
        }

        return super.removeAllInternal();
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    public reset() {
        this.removeAllInternal();
        this.manager = null;
        this.uuid = 0;
        this.flags = 0;
        this.scheduledForRemoval = false;
    }
}
