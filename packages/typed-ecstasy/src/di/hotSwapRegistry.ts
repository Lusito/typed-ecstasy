import type { Container } from "./Container";
import { HotSwapProxyConfig, HotSwapType } from "./hotSwapProxy";
import { ServiceMeta } from "./metaRegistry";

interface ListEntry {
    id: string;
    // fixme: can't use WeakRef for the config, since the config might not be in use anymore, but the proxy itself is..
    // .. maybe remove the HotSwapProxyConfig type and make the hotSwap method available through the proxy itself?
    config: HotSwapProxyConfig<HotSwapType>;
    containerRef: WeakRef<Container>;
}
let list: ListEntry[] = [];

/** @internal */
export interface HotSwapListener<T> {
    beforeHotSwap: (target: any) => T;
    afterHotSwap: (target: any, data: T) => void;
}

let hotSwapListener: HotSwapListener<unknown> = {
    beforeHotSwap: () => undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    afterHotSwap: () => {},
};

// eslint-disable-next-line jsdoc/require-returns, jsdoc/require-param
/** @internal */
export function setHotSwapListener<T>(listener: HotSwapListener<T>) {
    hotSwapListener = listener as HotSwapListener<unknown>;
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
    list = list.filter(({ config, containerRef, id }) => {
        const container = containerRef.deref();
        if (!container || !config) return false;
        if (id === meta.id) {
            // fixme: maybe add callback for services, which reference this instance?
            // fixme: give actual instance to listener and storeHotSwap rather than proxy?
            // fixme: allow multiple listeners?
            const data = hotSwapListener.beforeHotSwap(config.proxy);
            const oldData = storeRetainableProps(config.proxy, oldMeta.retainableProps);
            // eslint-disable-next-line dot-notation
            const newValue = container["create"](meta);
            config.hotSwap(newValue);
            restoreRetainableProps(newValue, meta.retainableProps, oldData);
            hotSwapListener.afterHotSwap(config.proxy, data);
        }
        return true;
    });
}

// eslint-disable-next-line jsdoc/require-returns, jsdoc/require-param
/** @internal */
export function registerHotSwapProxy(id: string, config: HotSwapProxyConfig<HotSwapType>, container: Container) {
    list.push({
        id,
        config,
        containerRef: new WeakRef(container),
    });
}
