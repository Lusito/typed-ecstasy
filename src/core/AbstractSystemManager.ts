/* eslint-disable dot-notation */
import { ContainerInstance } from "typedi";

import { createDelayedOperations } from "../utils/DelayedOperations";
import type { AbstractSystem, SystemConstructor } from "./AbstractSystem";

const systemEnabled = (system: AbstractSystem<any>) => system.isEnabled();

const compareSystems = (a: AbstractSystem<any>, b: AbstractSystem<any>) => a["priority"] - b["priority"];

/**
 * Base class for all system managers.
 *
 * @template TSystem The base system class (EntitySystem or SubSystem).
 */
export abstract class AbstractSystemManager<TSystem extends AbstractSystem<any>> {
    private readonly instances: TSystem[] = [];

    private readonly instancesByClass = new Map<SystemConstructor<TSystem>, TSystem>();

    private readonly container: ContainerInstance;

    // Mechanism to delay operations to avoid affecting system processing
    private delayedOperations = createDelayedOperations({
        add: <T extends TSystem>(system: T, priority: number) => this.addInternal(system, priority),
        remove: <T extends TSystem>(constructor: SystemConstructor<T>) => this.removeInternal(constructor),
        removeAll: () => this.removeAllInternal(),
        sort: () => this.instances.sort(compareSystems),
    });

    /** @param container The container instance to use. */
    public constructor(container: ContainerInstance) {
        this.container = container;
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected set delayOperations(shouldDelay: boolean) {
        this.delayedOperations.shouldDelay = shouldDelay;
    }

    /** @returns True if any added system is enabled. */
    public hasEnabledSystems() {
        return this.instances.some(systemEnabled);
    }

    /**
     * Adds the system to this manager.
     *
     * @template T The entity system class.
     * @param constructor The system to add.
     * @param priority The priority to execute this system with (lower means higher priority).
     * @returns The newly created system.
     */
    public add<T extends TSystem>(constructor: SystemConstructor<T>, priority = 0) {
        this.remove(constructor);

        const system = this.container.get(constructor);
        this.delayedOperations.add(system, priority);

        return system;
    }

    private addInternal<T extends TSystem>(system: T, priority: number) {
        const insertPosition = this.determineIndex(priority);
        this.instances.splice(insertPosition, 0, system);
        this.instancesByClass.set(Object.getPrototypeOf(system).constructor, system);
        system["priority"] = priority;
        system["manager"] = this;
        if (system.isEnabled()) system["onEnable"]();
    }

    private determineIndex(priority: number) {
        for (let i = 0; i < this.instances.length; i++) {
            if (this.instances[i]["priority"] > priority) return i;
        }
        return this.instances.length;
    }

    /**
     * Removes the system from this Engine.
     *
     * @param clazz The System class to remove.
     */
    public remove(clazz: SystemConstructor<TSystem>) {
        this.delayedOperations.remove(clazz);
    }

    private removeInternal(clazz: SystemConstructor<TSystem>) {
        const system = this.instancesByClass.get(clazz);
        /* istanbul ignore else: this will never happen */
        if (system) {
            const index = this.instances.indexOf(system);
            /* istanbul ignore if: this will never happen */
            if (index === -1) throw new Error("Found system instance by class, but not in list!");
            this.instances.splice(index, 1);
            this.instancesByClass.delete(clazz);
            if (system.isEnabled()) system["onDisable"]();
            system["manager"] = null;
        }
    }

    /**
     * Removes all systems registered with this Engine.
     */
    public removeAll() {
        this.delayedOperations.removeAll();
    }

    private removeAllInternal() {
        this.instancesByClass.forEach((system, clazz) => {
            if (system.isEnabled()) system["onDisable"]();
            system["manager"] = null;
        });
        this.instances.length = 0;
        this.instancesByClass.clear();
    }

    /**
     * Get a system by its class.
     *
     * @template T The entity system class.
     * @param clazz The constructor for T.
     * @returns The T of the specified class, or undefined if no such system exists.
     */
    public get<T extends TSystem>(clazz: SystemConstructor<T>) {
        return this.instancesByClass.get(clazz) as T | undefined;
    }

    /**
     * @returns A list of all entity systems managed by the Engine sorted by priority.
     */
    public getAll() {
        return this.instances;
    }
}
