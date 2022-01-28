import type { ComponentClass, ComponentClassWithConfig, ComponentFactory } from "./Component";
import type { Engine } from "./Engine";

export type ComponentMeta<TData = unknown, TConfig = unknown> = {
    id: number;
    key: string;
    factory: ComponentFactory<TData, TConfig>;
    class: ComponentClass<any, any>;
};

let nextId = 1;
const componentMetaMap: Record<string, ComponentMeta> = {};

/**
 * @param key The component key.
 * @returns The metadata for the specified component key, if it exists.
 */
export function getComponentMeta(key: string): Readonly<ComponentMeta> | undefined {
    return componentMetaMap[key];
}

export const enginesForComponentMetaRegistry = new Set<WeakRef<Engine>>();

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

    for (const ref of enginesForComponentMetaRegistry) {
        const engine = ref.deref();
        // eslint-disable-next-line dot-notation
        if (engine) engine["onComponentMetaDataChange"](meta.id);
        else enginesForComponentMetaRegistry.delete(ref);
    }

}
