export enum DelayedOperationType {
    Add,
    Remove,
    RemoveAll,
}

export class DelayedOperation<T> {
    public type: DelayedOperationType;

    public entry: T | null = null;

    public nextOperation: DelayedOperation<T> | null = null;

    public constructor(type: DelayedOperationType, entry: T | null) {
        this.type = type;
        this.entry = entry;
    }
}
