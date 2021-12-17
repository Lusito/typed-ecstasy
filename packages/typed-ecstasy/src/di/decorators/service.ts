import { enableHotContainers } from "../Container";
import { HotSwapType } from "../hotSwapProxy";
import { performHotSwap } from "../hotSwapRegistry";
import { metaRegistry } from "../metaRegistry";
import { Constructor } from "../types";

export interface ImportHot {
    accept: () => void;
    dispose: (cb: (data: any) => void) => void;
    data: any;
}

export type ServiceConfig = {
    /** A transient service will return a new instance every time you request it from the container. */
    transient?: boolean;

    /** If you pass in import.meta.webpackHot, you gain hot module replacement support. */
    hot?: ImportHot;
};

// eslint-disable-next-line jsdoc/require-returns
/**
 * Decorate a service class.
 *
 * @param id The unique ID for the service.
 * @param config The configuration for the service.
 */
export function service<TName extends string>(id: TName, config: ServiceConfig = {}) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return (target: Constructor<HotSwapType>) => {
        const meta = metaRegistry.registerService(target, id, config.transient);
        const { hot } = config;
        if (hot) {
            enableHotContainers();
            if (hot.data?.oldMeta) {
                performHotSwap(meta, hot.data.oldMeta);
            }
            hot.accept();
            hot.dispose((data) => {
                data.oldMeta = meta;
            });
        }
    };
}
