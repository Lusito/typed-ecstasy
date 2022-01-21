import { ComponentConfigGetter } from "../core/Component";
import { ComponentMeta, getComponentMeta } from "../core/componentMetaRegistry";

const emptyOverrides = {};

/**
 * Stores the name of a component and key/value pairs to construct the component.
 *
 * @see {@link AbstractEntityFactory}
 */
export class ComponentBlueprint {
    /** The component meta. */
    protected readonly meta?: ComponentMeta;

    private overrides: Record<string, unknown> = emptyOverrides;

    private defaultValues: Record<string, unknown>;

    /**
     * Creates a new blueprint with the specified component name.
     *
     * @param key The key of the component.
     * @param defaultValues The default values to use.
     */
    public constructor(key: string, defaultValues: Record<string, unknown> = {}) {
        this.meta = getComponentMeta(key);
        if (!this.meta) console.warn(`Can't find metadata for component "${key}". This component will not be added!`);
        this.defaultValues = defaultValues;
    }

    /**
     * Set the overrides map.
     *
     * @param overrides The overrides to use on the next get* calls.
     */
    protected setOverrides(overrides?: Record<string, unknown>) {
        this.overrides = overrides ?? emptyOverrides;
    }

    /**
     * Get a value.
     *
     * @param key The key.
     * @param fallback The value to return if no default value and no override value exists for the key.
     * @returns The corresponding value from overrides, defaultValues or the fallback parameter (in that order).
     */
    public get: ComponentConfigGetter<any> = (key, fallback) => {
        if (key in this.overrides) {
            const value = this.overrides[key];
            if (value !== undefined) return value as any;
        }
        if (key in this.defaultValues) {
            const value = this.defaultValues[key];
            if (value !== undefined) return value as any;
        }
        return fallback;
    };
}
