import { HotSwapType } from "../hotSwapProxy";
import { metaRegistry } from "../metaRegistry";
import { Constructor } from "../types";

// eslint-disable-next-line jsdoc/require-param, jsdoc/require-returns
/**
 * Mark a property as retainable.
 * Retainable properties will be restored during hot-module-replacement of a service.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function retainable(target: { constructor: Function }, key: string | symbol) {
    metaRegistry.registerRetainable(target.constructor as Constructor<HotSwapType>, key);
}
