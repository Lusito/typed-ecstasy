import type { Container } from "./Container";
import { HotSwapProxy, HotSwapType, HotSwapProxyTarget } from "./hotSwapProxy";
import type { ServiceMeta } from "./metaRegistry";
import { PostConstruct, PreDestroy, ServiceInstance } from "./symbols";

interface ListEntry {
    id: string;
    proxyRef: WeakRef<HotSwapType>;
    containerRef: WeakRef<Container>;
}
let list: ListEntry[] = [];

/** @internal */
export interface HotSwapListener<T> {
    beforeHotSwap: (target: any) => T;
    afterHotSwap: (target: any, data: T) => void;
}

const hotSwapListeners = new Set<HotSwapListener<unknown>>();

// eslint-disable-next-line jsdoc/require-returns, jsdoc/require-param
/** @internal */
export function addHotSwapListener<T>(listener: HotSwapListener<T>) {
    hotSwapListeners.add(listener as HotSwapListener<unknown>);
}

function storeRetainableProps(target: HotSwapType, retainableProps: Set<string | symbol>) {
    const data = new Map<string | symbol, any>();
    for (const key of retainableProps) {
        data.set(key, Reflect.get(target, key));
    }
    return data;
}

function restoreRetainableProps(
    target: HotSwapType,
    retainableProps: Set<string | symbol>,
    data: Map<string | symbol, any>
) {
    for (const key of retainableProps) {
        if (data.has(key)) {
            Reflect.set(target, key, data.get(key));
        }
    }
}

// eslint-disable-next-line jsdoc/require-returns, jsdoc/require-param
/** @internal */
export function performHotSwap<T extends HotSwapType>(meta: ServiceMeta<string, T>, oldMeta: ServiceMeta<string, T>) {
    list = list.filter(({ proxyRef, containerRef, id }) => {
        const proxy = proxyRef.deref();
        const container = containerRef.deref();
        if (!container || !proxy) return false;
        const oldValue = (proxy as HotSwapProxy)[HotSwapProxyTarget] as ServiceInstance;
        if (!oldValue) return false;
        if (id === meta.id) {
            // fixme: maybe inform services, which reference this instance?
            const listenerData = Array.from(hotSwapListeners).map((listener) => ({
                listener,
                data: listener.beforeHotSwap(oldValue),
            }));
            const oldData = storeRetainableProps(oldValue, oldMeta.retainableProps);
            oldValue[PreDestroy]?.();

            // eslint-disable-next-line dot-notation
            const newValue = container["create"](meta) as ServiceInstance;

            (proxy as HotSwapProxy)[HotSwapProxyTarget] = newValue;
            restoreRetainableProps(newValue, meta.retainableProps, oldData);
            newValue[PostConstruct]?.();
            for (const { listener, data } of listenerData) {
                listener.afterHotSwap(newValue, data);
            }
        }
        return true;
    });
}

// eslint-disable-next-line jsdoc/require-returns, jsdoc/require-param
/** @internal */
export function registerHotSwapProxy(id: string, proxy: HotSwapType, container: Container) {
    list.push({
        id,
        proxyRef: new WeakRef(proxy),
        containerRef: new WeakRef(container),
    });
}
