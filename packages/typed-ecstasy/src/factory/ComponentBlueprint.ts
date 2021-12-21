import { ComponentConfigGetter, ComponentTypeWithConfig } from "../core/Component";
import { componentMetaRegistry } from "../core/componentMetaRegistry";

const emptyOverrides = {};

/**
 * Stores the name of a component and key/value pairs to construct the component.
 *
 * @see {@link EntityFactory}
 * @template TConfig The blueprint interface.
 */
export class ComponentBlueprint<TName extends string, TData, TConfig> {
    /** The component type of this blueprint. */
    public readonly type?: ComponentTypeWithConfig<TName, TData, TConfig>;

    private overrides: Partial<TConfig> = emptyOverrides;

    private defaultValues: TConfig;

    /**
     * Creates a new blueprint with the specified component name.
     *
     * @param name The name of the component.
     * @param defaultValues The default values to use.
     */
    public constructor(name: string, defaultValues: TConfig) {
        const meta = componentMetaRegistry.get(name);
        if (meta) this.type = meta.type as ComponentTypeWithConfig<TName, TData, TConfig>;
        else console.warn(`Can't find metadata for component "${name}". This component will not be added!`);
        this.defaultValues = defaultValues;
    }

    /**
     * Set the overrides map.
     *
     * @param overrides The overrides to use on the next get* calls.
     */
    protected setOverrides(overrides?: Partial<TConfig>) {
        this.overrides = overrides ?? emptyOverrides;
    }

    /**
     * Get a value.
     *
     * @param key The key.
     * @param fallback The value to return if no default value and no override value exists for the key.
     * @returns The corresponding value from overrides, defaultValues or the fallback parameter (in that order).
     */
    public get: ComponentConfigGetter<TConfig> = (key, fallback) => {
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
