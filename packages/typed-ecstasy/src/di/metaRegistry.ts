import { getName } from "../utils/nameUtil";
import { HotSwapType } from "./hotSwapProxy";
import { getRetainablePropsRecursively, metaData } from "./metaData";
import { Constructor } from "./types";

/** @internal */
export type ServiceMeta<TName extends string, TType extends HotSwapType> = {
    id: TName;
    transient?: boolean;
    _unusedType?: TType;
    params: Array<Constructor<unknown>>;
    retainableProps: Set<string | symbol>;
    // fixme: weak ref?
    constructor: Constructor<TType>;
};

const serviceMetaById = new Map<string, ServiceMeta<string, HotSwapType>>();

/** @internal */
export const metaRegistry = {
    registerService(constructor: Constructor<HotSwapType>, id: string, transient?: boolean) {
        metaData.serviceId.set(constructor, id);

        const params = metaData.paramTypes.get(constructor);
        if (!params) throw new Error(`Could not find metadata for constructor parameters of ${constructor}`);
        params.forEach((param, index) => {
            if (param === Function) {
                throw new Error(
                    `Constructor parameter ${index} of ${getName(
                        constructor
                    )} has been passed as "Function". You probably used a type import instead of a normal import.`
                );
            }
        });

        const meta: ServiceMeta<string, HotSwapType> = {
            id,
            transient,
            constructor,
            retainableProps: getRetainablePropsRecursively(constructor),
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            params,
        };
        serviceMetaById.set(id, meta);
        return meta;
    },
    registerRetainable(constructor: Constructor<HotSwapType>, key: string | symbol) {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const entries = metaData.retainable.getOwn(constructor) || new Set();
        if (entries.has(key)) console.warn(`Key ${key.toString()} is already registered for hot-swap`);
        entries.add(key);
        metaData.retainable.set(constructor, entries);
    },
    get(id: string) {
        const meta = serviceMetaById.get(id);
        if (!meta) {
            throw new Error(`Could not find information about "${id}". Did you forget to add @service?`);
        }
        return meta;
    },
    getId(constructor: Constructor<HotSwapType>) {
        return metaData.serviceId.getOwn(constructor);
    },
};
