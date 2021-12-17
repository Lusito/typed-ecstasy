/* eslint-disable max-classes-per-file */
import type {} from "@abraham/reflection";
import { metaRegistry, ServiceMeta } from "./metaRegistry";
import { Constructor } from "./types";
import { createHotSwapProxy, HotSwapProxyConfig, HotSwapType } from "./hotSwapProxy";
import { registerHotSwapProxy } from "./hotSwapRegistry";

// fixme: solve this with no classes, but interface + objects instead?
// fixme: would it be possible to use proxies for manual dependencies as well?
// ... That would reduce the possibilities (i.e. no simple types, just objects)
/**
 * A dependency injection container.
 */
export abstract class Container {
    protected readonly values = new Map<unknown, unknown>();
    protected readonly parent?: Container;

    /**
     * Use Container.create() instead of this constructor.
     *
     * @param parent The parent container.
     */
    public constructor(parent?: Container) {
        this.parent = parent;
    }

    /**
     * Create a new container.
     *
     * @param parent The parent container.
     * @returns The new container.
     */
    public static create(parent?: Container) {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return new ContainerClass(parent);
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

        const id = metaRegistry.getId(key as unknown as Constructor<HotSwapType>);
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
    public get = <T>(key: Constructor<T>): T => {
        if (!key) throw new Error("You need to supply a key");

        const id = metaRegistry.getId(key as unknown as Constructor<HotSwapType>);
        if (id) {
            const value = this.findByKey(id);
            if (value) return value as T;
            return this.getById(id) as T;
        }

        const value = this.findByKey(key);
        if (value) return value as T;
        const name = "name" in key ? key.name : String(key);
        throw new Error(`Could not find value for symbol "${name}". Did you forget to set it manually?`);
    };

    /**
     * Get the value for the specified key. Create one if possible.
     *
     * @param id The id to find a value for.
     * @returns The value for the specified key.
     * @throws If no value was found and no value could be created.
     */
    protected abstract getById(id: string): unknown;

    /**
     * Get the value for the specified key.
     *
     * @param key The key to find a value for.
     * @returns The value for the specified key or undefined if none was found.
     */
    protected findByKey(key: unknown): unknown {
        const value = this.values.get(key);
        if (value) return value;
        if (this.parent) return this.parent.findByKey(key);
        return undefined;
    }

    /**
     * Create a value for the specified metadata.
     *
     * @param meta The metadata to create a value for.
     * @returns The newly created value.
     */
    protected create(meta: ServiceMeta<string, HotSwapType>): HotSwapType {
        const params = meta.params.map(this.get);
        const Class = meta.constructor as { new (...args: any[]): HotSwapType };
        return new Class(...params);
    }
}

class DefaultContainer extends Container {
    protected readonly byId = new Map<string, HotSwapType>();

    protected findById(id: string): HotSwapType | undefined {
        const value = this.byId.get(id);
        if (value) return value;
        if (this.parent) return (this.parent as DefaultContainer).findById(id);
        return undefined;
    }

    protected getById(id: string): HotSwapType {
        let value = this.findById(id);
        if (value) return value;

        const meta = metaRegistry.get(id);
        value = this.create(meta);

        if (!meta.transient) {
            this.byId.set(meta.id, value);
        }
        return value as HotSwapType;
    }
}

class HotContainer extends Container {
    protected readonly byId = new Map<string, HotSwapProxyConfig<HotSwapType>>();

    protected findById(id: string): HotSwapType | undefined {
        const config = this.byId.get(id);
        if (config) return config.proxy;
        if (this.parent) return (this.parent as HotContainer).findById(id);
        return undefined;
    }

    protected getById(id: string): HotSwapType {
        const value = this.findById(id);
        if (value) return value;

        const meta = metaRegistry.get(id);
        const config = createHotSwapProxy(this.create(meta));
        registerHotSwapProxy(meta.id, config, this);

        if (!meta.transient) {
            this.byId.set(meta.id, config);
        }

        return config.proxy as HotSwapType;
    }
}

interface ContainerConstructor {
    new (parent?: Container): Container;
}

let ContainerClass: ContainerConstructor = DefaultContainer;

// eslint-disable-next-line jsdoc/require-returns, jsdoc/require-param
/** @internal */
export function enableHotContainers() {
    ContainerClass = HotContainer;
}
