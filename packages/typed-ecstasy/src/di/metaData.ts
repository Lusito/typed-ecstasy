import type { HotSwapType } from "./hotSwapProxy";

function createMetaHelper<T>(symbol: string | symbol) {
    return {
        set(target: HotSwapType, value: T) {
            Reflect.defineMetadata(symbol, value, target);
        },
        get(target: HotSwapType) {
            return Reflect.getMetadata<T>(symbol, target);
        },
        getOwn(target: HotSwapType) {
            return Reflect.getOwnMetadata<T>(symbol, target);
        },
    };
}

/** @internal */
export const metaData = {
    paramTypes: createMetaHelper<any[]>("design:paramtypes"),
    serviceId: createMetaHelper<string>(Symbol("Service ID")),
    retainable: createMetaHelper<Set<string | symbol>>(Symbol("Service retainable properties")),
};

// eslint-disable-next-line jsdoc/require-returns, jsdoc/require-param
/** @internal */
export function getRetainablePropsRecursively(target: HotSwapType) {
    const set = new Set<string | symbol>();
    while (target) {
        const meta = metaData.retainable.getOwn(target);
        if (meta) meta.forEach((v) => set.add(v));
        target = Object.getPrototypeOf(target);
    }
    return set;
}
