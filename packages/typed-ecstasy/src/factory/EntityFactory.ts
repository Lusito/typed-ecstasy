/* eslint-disable dot-notation */
import type { ComponentBlueprint } from "./ComponentBlueprint";
import { Engine } from "../core/Engine";
import type { ComponentType } from "../core/Component";
import { service } from "../di";

export type UnknownComponentConfig = Record<string, unknown>;
export type UnknownEntityConfig = Record<string, UnknownComponentConfig>;

export type InferComponentConfigMap<T> = T extends ComponentType<infer TName, any, infer TConfig>
    ? [TConfig] extends [never]
        ? never
        : Record<TName, TConfig>
    : never;
export type InferEntityConfig<T> = (T extends any ? (x: InferComponentConfigMap<T>) => any : never) extends (
    x: infer R
) => any
    ? Partial<R>
    : never;

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
 */
@service("typed-ecstasy/EntityFactory")
export class EntityFactory<TEntityConfig extends UnknownEntityConfig = never> {
    private readonly entityBlueprints: Record<string, Array<ComponentBlueprint<string, unknown, unknown>>> = {};
    private readonly engine: Engine;

    /**
     * Creates a new EntityFactory.
     *
     * @param engine The engine to use.
     */
    public constructor(engine: Engine) {
        this.engine = engine;
    }

    /**
     * @param name The name used to identify the entity blueprint.
     * @param blueprint The list of component blueprints for this entity.
     */
    public addEntityBlueprint(name: string, blueprint: Array<ComponentBlueprint<string, unknown, unknown>>) {
        this.entityBlueprints[name] = blueprint;
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
        const entity = this.engine.obtainEntity();
        try {
            const blueprint = this.entityBlueprints[blueprintName];
            if (!blueprint) throw new Error(`Could not find entity blueprint for '${blueprintName}'`);

            for (const componentBlueprint of blueprint) {
                // eslint-disable-next-line prefer-destructuring
                const { type } = componentBlueprint;
                // Skip blueprints, where the component is not used in code
                if (!type) continue;

                componentBlueprint["setOverrides"](
                    overrides?.[type.name as keyof EntityConfigOverrides<TEntityConfig>]
                );
                const component = this.engine.obtainComponent(type, componentBlueprint.get);
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
