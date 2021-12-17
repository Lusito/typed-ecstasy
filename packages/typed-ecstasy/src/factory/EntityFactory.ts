/* eslint-disable dot-notation */
import { ObtainComponent, ComponentFactoryRegistry } from "./ComponentFactory";
import { ComponentBlueprint } from "./ComponentBlueprint";
import { Allocator } from "../core/Allocator";

/**
 * An object with overrides for each component.
 *
 * @template T The EntityConfig to override.
 */
export type EntityConfigOverrides<T> = {
    [P in keyof T]?: Partial<T[P]>;
};

/**
 * A factory to assemble {@link Entity entities} from blueprints.
 *
 * @template TEntityConfig The entity configuration type.
 * @template TContext The context type.
 */
export class EntityFactory<TEntityConfig, TContext> {
    private readonly componentFactories: ComponentFactoryRegistry<any, any>;

    private readonly context: TContext;

    private readonly entities: Record<string, ComponentBlueprint[]> = {};

    private readonly allocator: Allocator;

    private readonly obtainComponent: ObtainComponent;

    /**
     * Creates a new EntityFactory.
     *
     * @param componentFactories The component factory registry to use.
     * @param context The context to pass to component factories.
     * @param allocator The entity/component allocator to use.
     */
    public constructor(
        componentFactories: ComponentFactoryRegistry<any, any>,
        context: TContext,
        allocator: Allocator
    ) {
        this.componentFactories = componentFactories;
        this.allocator = allocator;
        this.context = context;
        this.obtainComponent = allocator.obtainComponent.bind(allocator);
    }

    /**
     * @param name The name used to identify the entity blueprint.
     * @param blueprint The list of component blueprints for this entity.
     */
    public addEntityBlueprint(name: string, blueprint: ComponentBlueprint[]) {
        this.entities[name] = blueprint;
    }

    /**
     * Creates and assembles an Entity.
     *
     * @param blueprintName The name of the entity blueprint.
     * @param overrides A map of overrides.
     * @returns A fully assembled Entity or null if the assembly failed.
     * @throws An exception if the entity could not be assembled.
     */
    public assemble(blueprintName: string, overrides?: EntityConfigOverrides<TEntityConfig>) {
        const entity = this.allocator.obtainEntity();
        try {
            const blueprint = this.entities[blueprintName];
            if (!blueprint) throw new Error(`Could not find entity blueprint for '${blueprintName}'`);

            for (const componentBlueprint of blueprint) {
                const factory = this.componentFactories.get(componentBlueprint.name);
                if (!factory) throw new Error(`Could not find component factory for '${componentBlueprint.name}'`);
                componentBlueprint["setOverrides"](
                    overrides?.[componentBlueprint.name as keyof EntityConfigOverrides<TEntityConfig>]
                );
                const component = factory(this.obtainComponent, componentBlueprint, this.context);
                if (component) entity.add(component);
                componentBlueprint["setOverrides"]();
            }
            return entity;
        } catch (e) {
            entity.removeAll();
            throw e;
        }
    }
}
