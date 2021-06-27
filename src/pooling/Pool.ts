/**
 * Objects implementing this interface will have {@link reset} called when passed to {@link Pool.free}.
 */
export interface Poolable {
    /** Resets the object for reuse. Object references should be nulled/undefined and fields may be set to default values. */
    reset?: () => void;
}

/**
 * A pool of objects that can be reused to avoid allocation.
 *
 * @template T The type of objects to pool.
 * @author Nathan Sweet
 */
export class Pool<T extends Poolable> {
    private readonly create: () => T;

    private readonly max: number;

    private readonly freeObjects: T[] = [];

    /**
     * Creates a pool with an initial capacity and a maximum.
     *
     * @param create A function to create a new object.
     * @param max The maximum number of free objects to store in this pool.
     */
    public constructor(create: () => T, max = Number.MAX_SAFE_INTEGER) {
        this.create = create;
        this.max = max;
    }

    /**
     * @returns An object from this pool. The object may be new or reused (previously {@link free freed}).
     */
    public obtain(): T {
        return this.freeObjects.pop() ?? this.create();
    }

    /**
     * Puts the specified object in the pool, making it eligible to be returned by {@link obtain}.
     * If the pool already contains {@link max} free objects, the specified object is not added to the pool.
     * The pool does not check if an object is already freed, so the same object must not be freed multiple times.
     *
     * @param object The object to free.
     */
    public free(object: T) {
        if (this.freeObjects.length < this.max) {
            this.freeObjects.push(object);
            object.reset?.();
        }
    }
}
