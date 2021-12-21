/* eslint-disable dot-notation */
import { Container } from "../di";
import { EntitySystemManager } from "./EntitySystemManager";
import { EntityManager } from "./EntityManager";
import { Allocator } from "./Allocator";
import {
    addComponentMetaListener,
    ComponentBuilder,
    ComponentBuilderWithConfig,
    ComponentConfigGetter,
    ComponentData,
    ComponentType,
    ComponentTypeWithConfig,
    getComponentMeta,
} from "./Component";

const noopConfig: ComponentConfigGetter<unknown> = (_key, fallback) => fallback;

/**
 * The heart of the Entity framework. It is responsible for keeping track of entities and systems.
 * The engine should be updated every tick via the {@link update} method.
 */
export class Engine {
    private readonly factories: Array<ComponentBuilder<unknown> | ComponentBuilderWithConfig<unknown, unknown>> = [];

    private readonly allocator: Allocator;

    public readonly container = new Container();

    public readonly systems: EntitySystemManager;

    public readonly entities: EntityManager;

    private updating = false;

    /**
     * Creates a new Engine.
     *
     * @param allocator The optional allocator to use for creating entities & components.
     */
    public constructor(allocator: Allocator = new Allocator()) {
        this.allocator = allocator;
        this.entities = new EntityManager(allocator);
        this.container.set(Engine, this);
        this.container.set(Container, this.container);
        this.systems = this.container.get(EntitySystemManager);

        // When the meta changes, just delete the factory and wait for it to be recreated on demand
        addComponentMetaListener((type) => {
            delete this.factories[type.id];
        });
    }

    /**
     * @returns True if this engine is currently updating systems.
     */
    public isUpdating() {
        return this.updating;
    }

    /**
     * Updates all the systems in this Engine.
     *
     * @param deltaTime The time passed since the last frame.
     */
    public update(deltaTime: number) {
        this.updating = true;

        if (this.systems.hasEnabledSystems()) {
            this.entities["delayOperations"] = true;
            this.systems["delayOperations"] = true;
            for (const system of this.systems.getAll()) {
                if (system.isEnabled()) system.update(deltaTime);

                this.entities["delayedOperations"].processDelayedOperations();
            }
            this.entities["delayOperations"] = false;
            this.systems["delayOperations"] = false;
        }
        this.updating = false;
    }

    public obtainEntity() {
        return this.allocator.obtainEntity();
    }

    public obtainComponent<TData>(type: ComponentType<string, TData>): ComponentData<TData> | undefined;
    public obtainComponent<TData, TConfig>(
        type: ComponentTypeWithConfig<string, TData, TConfig>,
        config: ComponentConfigGetter<TConfig>
    ): ComponentData<TData> | undefined;
    public obtainComponent<TData, TConfig>(
        type: ComponentType<string, TData> | ComponentTypeWithConfig<string, TData, TConfig>,
        config?: ComponentConfigGetter<TConfig>
    ) {
        let factory = this.factories[type.id];
        if (!factory) {
            factory = this.createComponentFactory(type.name);
            this.factories[type.id] = factory;
        }
        const comp = this.allocator.obtainComponent(type, factory);
        if (factory.build && factory.build(comp, config || noopConfig) === false) return undefined;
        return comp;
    }

    private createComponentFactory(name: string) {
        const meta = getComponentMeta(name);
        if (!meta) throw new Error(`Could not find component factory for "${name}"`);
        if (typeof meta.factory === "function") {
            return meta.factory(this.container);
        }
        return meta.factory;
    }
}
