/** @internal */
// eslint-disable-next-line @typescript-eslint/ban-types
export type HotSwapType = object;

/** @internal */
export const HOTSWAP_TARGET = Symbol("HotSwap Proxy Target");

/** @internal */
export type HotSwapProxy<T extends HotSwapType = HotSwapType> = {
    [HOTSWAP_TARGET]?: T;
};

// eslint-disable-next-line jsdoc/require-returns, jsdoc/require-param
/** @internal */
export function createHotSwapProxy<T extends HotSwapType>(initialTarget: T): T {
    let target = initialTarget;
    return new Proxy({} as T, {
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
            if (key === HOTSWAP_TARGET) return target;
            const x = Reflect.get(target, key, target);
            return typeof x === "function" ? x.bind(target) : x;
        },
        set(_, key, value) {
            if (key === HOTSWAP_TARGET) {
                target = value;
                return true;
            }
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
}
