import { DelayedOperation, DelayedOperationType } from "./DelayedOperation";

/**
 * The callback to actually perform the add/remove/removeAll operations.
 *
 * @typeparam T The entry class
 */
export interface DelayedOperationHandlerListener<T> {
    /**
     * @param: The entry to add
     */
    onAdd(entry: T): void;

    /**
     * @param: The entry to remove
     */
    onRemove(entry: T): void;

    /**
     * Remove all entries
     */
    onRemoveAll(): void;
}

/**
 * A class to help delaying add/remove/removeAll operations during engine updates.
 *
 * @typeparam T The entry class
 */
export class DelayedOperationHandler<T> {
    private nextOperation: DelayedOperation<T> | null = null;

    private lastOperation: DelayedOperation<T> | null = null;

    private listener: DelayedOperationHandlerListener<T>;

    /**
     * @param listener The listener callbacks
     */
    public constructor(listener: DelayedOperationHandlerListener<T>) {
        this.listener = listener;
    }

    /**
     * Process all scheduled add/remove/removeAll operations
     */
    public process() {
        while (this.nextOperation) {
            const operation = this.nextOperation;
            switch (operation.type) {
                case DelayedOperationType.Add:
                    if (operation.entry) this.listener.onAdd(operation.entry);
                    break;
                case DelayedOperationType.Remove:
                    if (operation.entry) this.listener.onRemove(operation.entry);
                    break;
                case DelayedOperationType.RemoveAll:
                    this.listener.onRemoveAll();
                    break;
                default:
                    throw new Error(`Unexpected Operation type: ${operation.type}`);
            }

            this.nextOperation = operation.nextOperation;
        }
        this.nextOperation = null;
        this.lastOperation = null;
    }

    protected schedule(type: DelayedOperationType, entry: T | null) {
        const operation = new DelayedOperation<T>(type, entry);
        if (this.lastOperation) this.lastOperation.nextOperation = operation;
        else this.nextOperation = operation;
        this.lastOperation = operation;
    }

    /**
     * Schedule an add operation
     *
     * @param entry the entry to add
     */
    public add(entry: T) {
        this.schedule(DelayedOperationType.Add, entry);
    }

    /**
     * Schedule a remove operation
     *
     * @param entry the entry to remove
     */
    public remove(entry: T) {
        this.schedule(DelayedOperationType.Remove, entry);
    }

    /**
     * Schedule a removeAll operation
     */
    public removeAll() {
        this.schedule(DelayedOperationType.RemoveAll, null);
    }
}
