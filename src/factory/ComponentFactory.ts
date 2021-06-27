import { ComponentBlueprint } from "./ComponentBlueprint";
import type { Component, NoArgsComponentConstructor } from "../core/Component";

export type ComponentConfig = Record<string, unknown>;
export type EntityConfig = Record<string, ComponentConfig>;

/**
 * A function, which creates a component.
 *
 * @template T The component class to be created.
 * @param clazz The constructor of the component.
 */
export type ObtainComponent = <T extends Component>(clazz: NoArgsComponentConstructor<T>) => T;

/**
 * A component factory creates a Component based on the blueprint.
 *
 * @template T The component config.
 * @template TContext The context type.
 * @param obtain A function to obtain a new or reused component instance.
 * @param context The context to use.
 * @param blueprint The blueprint.
 * @returns The component to add or null if it should not be added.
 */
export type ComponentFactory<T extends ComponentConfig, TContext> = (
    obtain: ObtainComponent,
    blueprint: ComponentBlueprint<T>,
    context: TContext
) => Component | null;

/**
 * A component factory registry.
 *
 * @template TEntityConfig The entity config to use.
 * @template TContext The context to be passed to component factories.
 */
export type ComponentFactoryRegistry<TEntityConfig extends EntityConfig, TContext> = {
    /**
     * Register a component factory.
     *
     * @template TName The type of name, do not specify manually!
     * @param name The name of the component as used in blueprints.
     * @param factory A function to assemble the component.
     */
    add: <TName extends keyof TEntityConfig>(
        name: TName,
        factory: ComponentFactory<Exclude<TEntityConfig[TName], undefined>, TContext>
    ) => void;
    get: (name: string) => ComponentFactory<any, TContext>;
};

/**
 * Create a registry for component factories.
 *
 * @template T The entity config to use.
 * @returns A new registry.
 */
export function createComponentFactoryRegistry<T extends EntityConfig, TContext>(): ComponentFactoryRegistry<
    T,
    TContext
> {
    const map: Record<string, ComponentFactory<any, TContext>> = {};
    return {
        add(name, assemble) {
            map[name as string] = assemble;
        },
        get(name) {
            return map[name];
        },
    };
}
