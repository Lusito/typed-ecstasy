import type { Container } from "../di";
import { ComponentMeta, componentMetaRegistry } from "./componentMetaRegistry";

export type ComponentConfigGetter<T> = <TKey extends Extract<keyof T, string>>(
    key: TKey,
    fallback: Exclude<T[TKey], undefined>
) => Exclude<T[TKey], undefined>;

export type ComponentBuilder<TData, TConfig> = {
    reset?(comp: TData): void;
} & ([TConfig] extends [never]
    ? {
          build?(comp: TData): void | boolean;
      }
    : {
          build(comp: TData, config: ComponentConfigGetter<TConfig>): void | boolean;
      });

export type ComponentFactory<TData, TConfig> =
    | ComponentBuilder<TData, TConfig>
    | ((container: Container) => ComponentBuilder<TData, TConfig>);

export type ComponentType<TName extends string = string, TData = unknown, TConfig = unknown> = {
    name: TName;
    id: number;
    _unusedData?: TData;
    _unusedConfig?: TConfig;
};

export type ComponentData<T> = T & {
    readonly componentId: number;
    readonly componentName: string;
    /** @internal */
    readonly componentFactory: Readonly<ComponentBuilder<T, unknown>>;
};

/**
 * Creates a builder object for declaring a new component type.
 *
 * @param name The name of the component.
 * @returns A builder object to continue building the component type.
 */
export function declareComponent<TName extends string>(name: TName) {
    const meta = componentMetaRegistry.getOrCreate(name);

    return {
        /**
         * Declare the component with a config object in mind.
         *
         * @param factory The factory to use.
         * @returns The new component type.
         */
        withConfig<TData, TConfig>(factory: ComponentFactory<TData, TConfig>) {
            (meta as ComponentMeta<TData, TConfig>).factory = factory;
            componentMetaRegistry.notifyListeners(meta);
            return meta.type as unknown as ComponentType<TName, TData, TConfig>;
        },
        /**
         * Declare the component without a config object in mind.
         *
         * @param factory The factory to use.
         * @returns The new component type.
         */
        withoutConfig<TData>(factory: ComponentFactory<TData, never>) {
            (meta as unknown as ComponentMeta<TData, never>).factory = factory;
            componentMetaRegistry.notifyListeners(meta);
            return meta.type as ComponentType<TName, TData, never>;
        },
    };
}

// fixme: can we save memory by only having one instance of a marker component? Is it worth the effort?
/**
 * Declares a simple marker component (i.e. A component without actual data).
 *
 * @param name The name of the component.
 * @returns The new component type.
 */
export const declareMarkerComponent = <TName extends string>(name: TName) =>
    declareComponent(name).withoutConfig<unknown>({});

/**
 * Check if a component data object matches a specified component type.
 *
 * @param data The component data to check.
 * @param type The component type to compare against.
 * @returns True if data matches the specified component type.
 */
export function isComponent<T>(data: ComponentData<unknown>, type: ComponentType<any, any>): data is ComponentData<T> {
    return data.componentId === type.id;
}
