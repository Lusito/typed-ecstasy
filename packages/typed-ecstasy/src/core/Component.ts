import { Container } from "../di";

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

export type ComponentMeta =
    | {
          type: ComponentType;
          withConfig: false;
          factory: ComponentFactory<unknown>;
      }
    | {
          type: ComponentType;
          withConfig: true;
          factory: ComponentFactoryWithConfig<unknown, unknown>;
      };

let nextId = 1;
const componentMetaMap: Record<string, ComponentMeta> = {};

export function getComponentMeta(name: string): Readonly<ComponentMeta> | undefined {
    return componentMetaMap[name];
}

const listeners = new Set<(type: ComponentType) => void>();
export function addComponentMetaListener(listener: (type: ComponentType) => void) {
    listeners.add(listener);
}

export function declareComponent<TName extends string>(name: TName) {
    let meta = componentMetaMap[name];
    if (!meta) {
        meta = {
            type: {
                name,
                id: nextId++,
            },
        } as unknown as ComponentMeta;
        componentMetaMap[name] = meta;
    }
    return {
        withConfig<TData, TConfig>(factory: ComponentFactoryWithConfig<TData, TConfig>) {
            meta.withConfig = true;
            meta.factory = factory as ComponentFactoryWithConfig<TData, unknown>;
            listeners.forEach((listener) => listener(meta.type));
            return meta.type as ComponentTypeWithConfig<TName, TData, TConfig>;
        },
        withoutConfig<TData>(factory: ComponentFactory<TData>) {
            meta.withConfig = false;
            meta.factory = factory;
            listeners.forEach((listener) => listener(meta.type));
            return meta.type as ComponentType<TName, TData>;
        },
    };
}

export const declareMarkerComponent = <TName extends string>(name: TName) => declareComponent(name).withoutConfig<unknown>({});

export function isComponent<T>(
    instance: ComponentData<unknown>,
    declaredComponent: ComponentType<any, any>
): instance is ComponentData<T> {
    return instance.componentId === declaredComponent.id;
}
