interface Node {
    fn: (...args: any[]) => void;
    args: any[];
    next: Node | null;
}

class DelayedOperationsImpl<T extends Record<string, (...args: any[]) => void>> {
    private next: Node | null = null;

    private last: Node | null = null;

    private processingDelayedOperations = false;

    // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
    #shouldDelay = false;

    public constructor(operations: T) {
        for (const key of Object.keys(operations)) {
            const fn = operations[key];
            const wrappedFn = (...args: any[]) => {
                if (this.#shouldDelay) {
                    const operation = { args, fn, next: null };
                    if (this.last) this.last.next = operation;
                    else this.next = operation;
                    this.last = operation;
                } else {
                    fn(...args);
                }
            };
            (this as any)[key] = wrappedFn;
        }
    }

    public set shouldDelay(shouldDelay: boolean) {
        if (this.#shouldDelay !== shouldDelay) {
            this.#shouldDelay = shouldDelay;
            if (!shouldDelay && this.next) this.processDelayedOperations();
        }
    }

    public get shouldDelay() {
        return this.#shouldDelay;
    }

    public processDelayedOperations(): void {
        if (this.processingDelayedOperations) return;
        this.processingDelayedOperations = true;
        while (this.next) {
            const op = this.next;
            op.fn(...op.args);
            this.next = op.next;
        }
        this.last = null;
        this.processingDelayedOperations = false;
    }
}

/**
 * Represents the managing class to delay operations.
 *
 * @template T The type of the object containing methods to be delayed.
 */
export type DelayedOperations<T extends Record<string, (...args: any[]) => void>> = T & {
    shouldDelay: boolean;

    /**
     * Process all delayed operations.
     */
    processDelayedOperations(): void;
};

/**
 * A helper for delaying operations during engine updates.
 *
 * @param operations An object containing methods to be delayed.
 * @returns A new DelayedOperations instance.
 */
export function createDelayedOperations<T extends Record<string, (...args: any[]) => void>>(
    operations: T
): DelayedOperations<T> {
    return new DelayedOperationsImpl(operations) as any;
}
