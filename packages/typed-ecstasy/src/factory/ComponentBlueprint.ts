const emptyOverrides = {};

/**
 * Stores the name of a component and key/value pairs to construct the component.
 *
 * @see {@link EntityFactory}
 * @template T The blueprint interface.
 */
export class ComponentBlueprint<T = any> {
    /** The name of this blueprint. */
    public readonly name: string;

    private overrides: Record<string, any> = emptyOverrides;

    private defaultValues: T;

    /**
     * Creates a new blueprint with the specified component name.
     *
     * @param name The name of the component.
     * @param defaultValues The default values to use.
     */
    public constructor(name: string, defaultValues: T) {
        this.name = name;
        this.defaultValues = defaultValues;
    }

    /**
     * Set the overrides map.
     *
     * @param overrides The overrides to use on the next get* calls.
     */
    protected setOverrides(overrides?: Partial<T>) {
        this.overrides = overrides ?? emptyOverrides;
    }

    /**
     * Get a value.
     *
     * @template TKey The type of key, do not specify manually!
     * @param key The key.
     * @param fallback The value to return if no default value and no override value exists for the key.
     * @returns The corresponding value from overrides, defaultValues or the fallback parameter (in that order).
     */
    public get<TKey extends Extract<keyof T, string>>(
        key: TKey,
        fallback: Exclude<T[TKey], undefined>
    ): Exclude<T[TKey], undefined> {
        if (key in this.overrides) {
            const value = this.overrides[key];
            if (value !== undefined) return value;
        }
        if (key in this.defaultValues) {
            const value = this.defaultValues[key];
            if (value !== undefined) return value as unknown as Exclude<T[TKey], undefined>;
        }
        return fallback;
    }
}
