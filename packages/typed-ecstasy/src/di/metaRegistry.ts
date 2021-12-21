import { HotSwapType } from "./hotSwapProxy";
import { getRetainablePropsRecursively, metaData } from "./metaData";
import { Constructor, getConstructorName } from "./Constructor";

/** @internal */
export type ServiceMeta<TName extends string, TType extends HotSwapType> = {
    id: TName;
    transient?: boolean;
    _unusedType?: TType;
    params: Array<Constructor<unknown>>;
    retainableProps: Set<string | symbol>;
    constructor: Constructor<TType>;
};

const serviceMetaById = new Map<string, ServiceMeta<string, HotSwapType>>();

/** @internal */
export const metaRegistry = {
    registerService(constructor: Constructor<HotSwapType>, id: string, transient?: boolean) {
        const params = metaData.paramTypes.get(constructor);
        if (!params) throw new Error(`Could not find metadata for constructor parameters of ${constructor}`);
        params.forEach((param, index) => {
            if (param === Function) {
                throw new Error(
                    `Constructor parameter ${index} of ${getConstructorName(
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
        metaData.serviceId.set(constructor, id);
        return meta;
    },
    registerRetainable(constructor: Constructor<HotSwapType>, key: string | symbol) {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const entries = metaData.retainable.getOwn(constructor) || new Set();
        if (entries.has(key)) console.warn(`Key ${key.toString()} is already registered for hot-swap`);
        entries.add(key);
        metaData.retainable.set(constructor, entries);
    },
    get<T extends HotSwapType>(constructor: Constructor<T>) {
        const id = metaData.serviceId.getOwn(constructor);
        if (!id) return null;

        const meta = serviceMetaById.get(id);
        if (!meta) {
            throw new Error(`Found id "${id}", but no metadata.. this should not be possible!`);
        }
        return meta as ServiceMeta<string, T>;
    },
    getId(constructor: Constructor<HotSwapType>) {
        return metaData.serviceId.getOwn(constructor);
    },
};
