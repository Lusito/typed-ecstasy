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

export function declareComponent<TName extends string>(name: TName) {
    const meta = componentMetaRegistry.getOrCreate(name);

    return {
        withConfig<TData, TConfig>(factory: ComponentFactory<TData, TConfig>) {
            (meta as ComponentMeta<TData, TConfig>).factory = factory;
            componentMetaRegistry.notifyListeners(meta);
            return meta.type as unknown as ComponentType<TName, TData, TConfig>;
        },
        withoutConfig<TData>(factory: ComponentFactory<TData, never>) {
            (meta as unknown as ComponentMeta<TData, never>).factory = factory;
            componentMetaRegistry.notifyListeners(meta);
            return meta.type as ComponentType<TName, TData, never>;
        },
    };
}

// fixme: can we save memory by only having one instance of a marker component? Is it worth the effort?
export const declareMarkerComponent = <TName extends string>(name: TName) =>
    declareComponent(name).withoutConfig<unknown>({});

export function isComponent<T>(
    instance: ComponentData<unknown>,
    declaredComponent: ComponentType<any, any>
): instance is ComponentData<T> {
    return instance.componentId === declaredComponent.id;
}
