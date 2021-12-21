import type { Container } from "../di";
import { componentMetaRegistry } from "./componentMetaRegistry";

export type ComponentConfigGetter<T> = <TKey extends Extract<keyof T, string>>(
    key: TKey,
    fallback: Exclude<T[TKey], undefined>
) => Exclude<T[TKey], undefined>;

export type ComponentBuilder<TData> = {
    reset?(comp: TData): void;
    build?(comp: TData): void | boolean;
};

export type ComponentBuilderWithConfig<TData, TConfig> = {
    reset?(comp: TData): void;
    build(comp: TData, config: ComponentConfigGetter<TConfig>): void | boolean;
};

export type ComponentFactory<TData> = ComponentBuilder<TData> | ((container: Container) => ComponentBuilder<TData>);

export type ComponentFactoryWithConfig<TData, TConfig> =
    | ComponentBuilderWithConfig<TData, TConfig>
    | ((container: Container) => ComponentBuilderWithConfig<TData, TConfig>);

export type ComponentType<TName extends string = string, TData = unknown> = {
    name: TName;
    id: number;
    _unusedData?: TData;
};
export type ComponentTypeWithConfig<TName extends string, TData, TConfig> = ComponentType<TName, TData> & {
    _unusedConfig?: TConfig;
};

export type ComponentData<T> = T & {
    readonly componentId: number;
    readonly componentName: string;
    /** @internal */
    readonly componentFactory: Readonly<ComponentBuilder<T>> | Readonly<ComponentBuilderWithConfig<T, unknown>>;
};

export function declareComponent<TName extends string>(name: TName) {
    const meta = componentMetaRegistry.getOrCreate(name);

    return {
        withConfig<TData, TConfig>(factory: ComponentFactoryWithConfig<TData, TConfig>) {
            meta.withConfig = true;
            meta.factory = factory as ComponentFactoryWithConfig<TData, unknown>;
            componentMetaRegistry.notifyListeners(meta);
            return meta.type as ComponentTypeWithConfig<TName, TData, TConfig>;
        },
        withoutConfig<TData>(factory: ComponentFactory<TData>) {
            meta.withConfig = false;
            meta.factory = factory;
            componentMetaRegistry.notifyListeners(meta);
            return meta.type as ComponentType<TName, TData>;
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
