import type { ComponentClass, ComponentClassWithConfig, ComponentFactory } from "./Component";

export type ComponentMeta<TData = unknown, TConfig = unknown> = {
    id: number;
    key: string;
    factory: ComponentFactory<TData, TConfig>;
    class: ComponentClass<any, any>;
};

let nextId = 1;
const componentMetaMap: Record<string, ComponentMeta> = {};
const listeners = new Set<(id: number) => void>();

/**
 * @param key The component key.
 * @returns The metadata for the specified component key, if it exists.
 */
export function getComponentMeta(key: string): Readonly<ComponentMeta> | undefined {
    return componentMetaMap[key];
}

/**
 * Get notified when component metadata changes.
 *
 * @param listener This listener will be called with the component id that was changed.
 */
export function addComponentMetaListener(listener: (id: number) => void) {
    listeners.add(listener);
}

export type FactoryForClass<T> = T extends ComponentClassWithConfig<any, infer TType, infer TConfig>
    ? ComponentFactory<TType, TConfig>
    : T extends ComponentClass<any, infer TType>
    ? ComponentFactory<TType, never>
    : never;

/**
 * Registers a component.
 *
 * @param Class The component class to use.
 * @param factory The factory to use.
 */
export function registerComponent<T extends ComponentClass<any, any>>(Class: T, factory: FactoryForClass<T>) {
    const { key } = Class;
    let meta = componentMetaMap[key];
    if (!meta) {
        meta = {
            id: nextId++,
            key,
        } as unknown as ComponentMeta;
        componentMetaMap[key] = meta;
    }
    (Class as { id: number }).id = meta.id;
    meta.class = Class;
    meta.factory = factory as ComponentFactory<unknown, unknown>;
    listeners.forEach((listener) => listener(meta.id));
}
