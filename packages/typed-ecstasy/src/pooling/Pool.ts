/**
 * A pool of objects that can be reused to avoid allocation.
 *
 * @template T The type of objects to pool.
 * @author Nathan Sweet
 */
export class Pool<T> {
    private readonly max: number;

    private readonly freeObjects: T[] = [];

    /**
     * Creates a pool with an initial capacity and a maximum.
     *
     * @param max The maximum number of free objects to store in this pool.
     */
    public constructor(max = Number.MAX_SAFE_INTEGER) {
        this.max = max;
    }

    /**
     * @returns An object from this pool or undefined if no more objects are in this pool.
     */
    public obtain() {
        return this.freeObjects.pop();
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
        }
    }
}
