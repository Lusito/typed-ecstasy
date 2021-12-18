
/** @internal */
// eslint-disable-next-line @typescript-eslint/ban-types
export type HotSwapType = object;
/** @internal */
export interface HotSwapProxyConfig<T> {
    proxy: T;
    hotSwap: (newTarget: T) => void;
}

// eslint-disable-next-line jsdoc/require-returns, jsdoc/require-param
/** @internal */
export function createHotSwapProxy<T extends HotSwapType>(initialTarget: T): HotSwapProxyConfig<T> {
    let target = initialTarget; // fixme: weakref to allow garbage collection?
    const proxy = new Proxy({} as T, {
        apply(_, self, args) {
            return Reflect.apply(target as any, self, args);
        },
        construct(_, args) {
            return Reflect.construct(target as any, args);
        },
        setPrototypeOf(_, proto) {
            return Reflect.setPrototypeOf(target, proto);
        },
        defineProperty(_, key, attributes) {
            return Reflect.defineProperty(target, key, attributes);
        },
        deleteProperty(_, key) {
            return Reflect.deleteProperty(target, key);
        },
        get(_, key) {
            const x = Reflect.get(target, key, target);
            return typeof x === "function" ? x.bind(target) : x;
        },
        set(_, key, value) {
            return Reflect.set(target, key, value, target);
        },
        getOwnPropertyDescriptor(_, key) {
            return Reflect.getOwnPropertyDescriptor(target, key);
        },
        getPrototypeOf() {
            return Reflect.getPrototypeOf(target);
        },
        has(_, key) {
            return Reflect.has(target, key);
        },
        isExtensible() {
            return Reflect.isExtensible(target);
        },
        ownKeys() {
            return Reflect.ownKeys(target);
        },
        preventExtensions() {
            return Reflect.preventExtensions(target);
        },
    });
    return {
        proxy,
        hotSwap(newTarget) {
            target = newTarget;
        },
    };
}