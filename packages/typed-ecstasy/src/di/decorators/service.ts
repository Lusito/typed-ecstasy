import { enableHotSwapProxying } from "../Container";
import type { HotSwapType } from "../hotSwapProxy";
import { performHotSwap } from "../hotSwapRegistry";
import { metaRegistry, ServiceMeta } from "../metaRegistry";
import type { Constructor } from "../Constructor";

export interface ImportHot {
    accept: () => void;
    dispose: (cb: (data: any) => void) => void;
    data: any;
}

// fixme: decide on interface vs type
export type ServiceConfig = {
    /** A transient service will return a new instance every time you request it from the container. */
    transient?: boolean;

    /** If you pass in import.meta.webpackHot, you gain hot module replacement support. */
    hot?: ImportHot;
};

interface ImportHotData {
    meta: ServiceMeta<HotSwapType>;
}

// eslint-disable-next-line jsdoc/require-returns
/**
 * Decorate a service class.
 *
 * @param config The configuration for the service.
 */
export function service(config: ServiceConfig = {}) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Constructor<HotSwapType>) => {
        const { hot, transient } = config;
        if (hot) {
            enableHotSwapProxying();

            const oldMeta = (hot.data as ImportHotData | undefined)?.meta;
            const meta = metaRegistry.registerService(target, transient, oldMeta);

            if (oldMeta) {
                performHotSwap(meta, oldMeta);
            }
            hot.accept();
            hot.dispose((data: ImportHotData) => {
                data.meta = meta;
            });
        } else {
            metaRegistry.registerService(target, transient);
        }
    };
}
