import type {} from "@abraham/reflection";
import { metaRegistry, ServiceMeta } from "./metaRegistry";
import type { Constructor } from "./Constructor";
import { createHotSwapProxy, HotSwapType } from "./hotSwapProxy";
import { registerHotSwapProxy } from "./hotSwapRegistry";
import { getConstructorName } from "./Constructor";

let isHotSwapProxyingEnabled = false;

// eslint-disable-next-line jsdoc/require-returns, jsdoc/require-param
/** @internal */
export function enableHotSwapProxying() {
    isHotSwapProxyingEnabled = true;
}

/**
 * A dependency injection container.
 */
export class Container {
    private readonly values = new Map<unknown, unknown>();
    private readonly parent?: Container;

    /**
     * Create a new container.
     *
     * @param parent The parent container.
     */
    public constructor(parent?: Container) {
        this.parent = parent;
    }

    /**
     * Set a value manually.
     *
     * @param key The key for the value to set.
     * @param value The value to set.
     * @throws When no key as supplied.
     */
    public set<T>(key: Constructor<T>, value: T) {
        if (!key) throw new Error("You need to supply a key");

        const id = metaRegistry.getId(key);
        this.values.set(id ?? key, value);
    }

    /**
     * Get a value by its key.
     *
     * @param key The key to find a value for.
     * @returns The value for the specified key.
     * @throws When no key as supplied.
     * @throws When no value was found for the specified key.
     */
    public get = <T extends HotSwapType>(key: Constructor<T>): T => {
        if (!key) throw new Error("You need to supply a key");

        const meta = metaRegistry.get(key);
        return meta ? this.getForMeta(meta) : this.getForKey(key);
    };

    private getForKey<T extends HotSwapType>(key: Constructor<T>) {
        const value = this.find(key);
        if (value) return value as T;
        throw new Error(
            `Could not find value for symbol "${getConstructorName(key)}". Did you forget to set it manually?`
        );
    }

    private getForMeta<T extends HotSwapType>(meta: ServiceMeta<string, T>) {
        let value = this.find(meta.id);
        if (!value) {
            value = this.create(meta);
            if (isHotSwapProxyingEnabled) {
                value = createHotSwapProxy(value);
                registerHotSwapProxy(meta.id, value, this);
            }

            if (!meta.transient) {
                this.values.set(meta.id, value);
            }
        }
        return value as T;
    }

    /**
     * Get the value for the specified key.
     *
     * @param key The key to find a value for.
     * @returns The value for the specified key or undefined if none was found.
     */
    private find(key: unknown): HotSwapType | undefined {
        const value = this.values.get(key);
        if (value) return value as HotSwapType;
        if (this.parent) return this.parent.find(key);
        return undefined;
    }

    /**
     * Create a value for the specified metadata.
     *
     * @param meta The metadata to create a value for.
     * @returns The newly created value.
     */
    private create(meta: ServiceMeta<string, HotSwapType>): HotSwapType {
        const params = meta.params.map(this.get);
        const Class = meta.constructor as { new (...args: any[]): HotSwapType };
        return new Class(...params);
    }
}
