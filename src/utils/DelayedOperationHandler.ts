/*******************************************************************************
 * Copyright 2015 See AUTHORS file.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

enum DelayedOperationType {
    Add,
    Remove,
    RemoveAll
}

class DelayedOperation<T> {
    public type: DelayedOperationType;
    public entry: T | null = null;
    public nextOperation: DelayedOperation<T> | null = null;

    public constructor(type: DelayedOperationType, entry: T | null) {
        this.type = type;
        this.entry = entry;
    }
}

/**
 * The callback to actually perform the add/remove/removeAll operations.
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
    public process(): void {
        while (this.nextOperation) {
            let operation = this.nextOperation;
            switch (operation.type) {
                case DelayedOperationType.Add:
                    if (operation.entry)
                        this.listener.onAdd(operation.entry);
                    break;
                case DelayedOperationType.Remove:
                    if (operation.entry)
                        this.listener.onRemove(operation.entry);
                    break;
                case DelayedOperationType.RemoveAll:
                    this.listener.onRemoveAll();
                    break;
                default:
                    throw "Unexpected Operation type: " + operation.type;
            }

            this.nextOperation = operation.nextOperation;
        }
        this.nextOperation = null;
        this.lastOperation = null;
    }

    protected schedule(type: DelayedOperationType, entry: T | null): void {
        let operation = new DelayedOperation<T>(type, entry);
        if (this.lastOperation)
            this.lastOperation.nextOperation = operation;
        else
            this.nextOperation = operation;
        this.lastOperation = operation;
    }

    /**
     * Schedule an add operation
     * 
     * @param entry the entry to add
     */
    public add(entry: T): void {
        this.schedule(DelayedOperationType.Add, entry);
    }

    /**
     * Schedule a remove operation
     * 
     * @param entry the entry to remove
     */
    public remove(entry: T): void {
        this.schedule(DelayedOperationType.Remove, entry);
    }

    /**
     * Schedule a removeAll operation
     */
    public removeAll(): void {
        this.schedule(DelayedOperationType.RemoveAll, null);
    }
}
