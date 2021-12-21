import type { ComponentFactory, ComponentType } from "./Component";

export type ComponentMeta<TData = unknown, TConfig = unknown> = {
    type: ComponentType;
    factory: ComponentFactory<TData, TConfig>;
};

let nextId = 1;
const componentMetaMap: Record<string, ComponentMeta> = {};
const listeners = new Set<(type: ComponentType) => void>();

export const componentMetaRegistry = {
    get(name: string): Readonly<ComponentMeta> | undefined {
        return componentMetaMap[name];
    },
    getOrCreate(name: string) {
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
        return meta;
    },
    addListener(listener: (type: ComponentType) => void) {
        listeners.add(listener);
    },
    notifyListeners(meta: ComponentMeta) {
        listeners.forEach((listener) => listener(meta.type));
    },
};
