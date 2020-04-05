const emptyOverrides = {};

/**
 * Stores the name of a component and key/value pairs to construct the component.
 * See EntityFactory.
 */
export class ComponentBlueprint {
    /** The name of this blueprint */
    public readonly name: string;

    private overrides: { [s: string]: any } = emptyOverrides;

    private values: { [s: string]: string | boolean | number | null } = {};

    /**
     * Creates a new blueprint with the specified component name
     *
     * @param name the name of the component.
     */
    public constructor(name: string) {
        this.name = name;
    }

    /**
     * Set the overrides map
     *
     * @param overrides the overrides to use on the next get* calls
     */
    public setOverrides(overrides?: { [s: string]: any }) {
        this.overrides = overrides ?? emptyOverrides;
    }

    /**
     * Set a key/value pair
     *
     * @param key the key
     * @param value the value
     */
    public set(key: string, value: any) {
        this.values[key] = value;
    }

    /**
     * Get a boolean value
     *
     * @param key the key
     * @param defaultValue the value to return if no value exists for key.
     * @return The corresponding value or defaultValue if none exists.
     */
    public getBool(key: string, defaultValue: boolean): boolean {
        if (key in this.overrides) {
            const value = this.overrides[key];
            if (value === true || value === false) return value;
        }
        if (key in this.values) {
            const value = this.values[key];
            if (value === true || value === false) return value;
        }
        return defaultValue;
    }

    /**
     * Get an integer value
     *
     * @param key the key
     * @param defaultValue the value to return if no value exists for key.
     * @return The corresponding value or defaultValue if none exists.
     */
    public getNumber(key: string, defaultValue: number): number {
        if (key in this.overrides) {
            const value = this.overrides[key];
            if (typeof value === "number") return value;
        }
        if (key in this.values) {
            const value = this.values[key];
            if (typeof value === "number") return value;
        }
        return defaultValue;
    }

    /**
     * Get a string value
     *
     * @param key the key
     * @param defaultValue the value to return if no value exists for key.
     * @return The corresponding value or defaultValue if none exists.
     */
    public getString(key: string, defaultValue: string): string {
        if (key in this.overrides) {
            const value = this.overrides[key];
            if (typeof value === "string") return value;
        }
        if (key in this.values) {
            const value = this.values[key];
            if (typeof value === "string") return value;
        }
        return defaultValue;
    }

    /**
     * Get any type of value
     *
     * @param key the key
     * @param defaultValue the value to return if no value exists for key.
     * @return The corresponding value or defaultValue if none exists.
     */
    public getAny(key: string, defaultValue: any) {
        if (key in this.overrides) return this.overrides[key];
        if (key in this.values) return this.values[key];
        return defaultValue;
    }
}
