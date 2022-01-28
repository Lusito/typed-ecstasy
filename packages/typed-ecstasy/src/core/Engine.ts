/* eslint-disable dot-notation */
import { Container } from "../di";
import { EntitySystemManager } from "./EntitySystemManager";
import { EntityManager } from "./EntityManager";
import { Allocator } from "./Allocator";
import {
    Component,
    ComponentBuilder,
    ComponentClass,
    ComponentClassWithConfig,
    ComponentConfigGetter,
} from "./Component";
import { enginesForComponentMetaRegistry, getComponentMeta } from "./componentMetaRegistry";

const noopConfig: ComponentConfigGetter<unknown> = (_key, fallback) => fallback;

export interface EngineOptions {
    allocator?: Allocator;
    container?: Container;
}

/**
 * The heart of the Entity framework. It is responsible for keeping track of entities and systems.
 * The engine should be updated every tick via the {@link update} method.
 */
export class Engine {
    private readonly builders: Array<ComponentBuilder<unknown, unknown>> = [];

    private readonly allocator: Allocator;

    public readonly container: Container;

    public readonly systems: EntitySystemManager;

    public readonly entities: EntityManager;

    private updating = false;

    /**
     * Creates a new Engine.
     *
     * @param options The optional allocator to use for creating entities & components.
     */
    public constructor(options: EngineOptions = {}) {
        this.allocator = options.allocator ?? new Allocator();
        this.container = options.container ?? new Container();
        this.entities = new EntityManager(this.allocator);
        this.container.set(Engine, this);
        this.systems = this.container.get(EntitySystemManager);

        // Register engine reference, so we can get notified about changes
        enginesForComponentMetaRegistry.add(new WeakRef(this));
    }

    /**
     * Called when a components metadata changes.
     *
     * @param id The component class id.
     */
    protected onComponentMetaDataChange(id: number) {
        delete this.builders[id];
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

    /**
     * @returns A new or recycled entity.
     */
    public obtainEntity() {
        return this.allocator.obtainEntity();
    }

    /**
     * @param type The component type to obtain.
     * @param config The configuration to use.
     * @returns The new or recycled component or undefined.
     */
    public obtainComponent<TType extends Component, TConfig>(
        Class: ComponentClassWithConfig<any, TType, TConfig>,
        config: ComponentConfigGetter<TConfig>
    ): TType | undefined;
    /**
     * @param type The component type to obtain.
     * @returns The new or recycled component or undefined.
     */
    public obtainComponent<TType extends Component>(Class: ComponentClass<any, TType>): TType | undefined;
    // eslint-disable-next-line jsdoc/require-jsdoc
    public obtainComponent<TType extends Component, TConfig>(
        Class: ComponentClass<any, TType> | ComponentClassWithConfig<any, TType, TConfig>,
        config?: ComponentConfigGetter<TConfig>
    ) {
        let builder = this.builders[Class.id];
        if (!builder) {
            builder = this.createComponentBuilder(Class.key);
            this.builders[Class.key] = builder;
        }
        const comp = this.allocator.obtainComponent(Class, builder);
        if (builder.build && builder.build(comp, config || noopConfig) === false) return undefined;
        return comp;
    }

    private createComponentBuilder(key: string) {
        const meta = getComponentMeta(key);
        if (!meta) throw new Error(`Could not find component meta for "${key}"`);
        if (typeof meta.factory === "function") {
            return meta.factory(this.container);
        }
        return meta.factory;
    }
}
