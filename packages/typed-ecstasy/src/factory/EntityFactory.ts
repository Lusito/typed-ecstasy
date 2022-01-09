/* eslint-disable dot-notation */
import { Engine } from "../core/Engine";
import type { ComponentType } from "../core/Component";
import { service } from "../di";
import type { EntityBlueprint } from "./EntityBlueprint";

export type PartialEntityConfig<T extends ComponentType<any, any, any>> = T extends ComponentType<
    infer TName,
    any,
    infer TConfig
>
    ? [TConfig] extends [never]
        ? Partial<Record<TName, true>>
        : Partial<Record<TName, TConfig>>
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
@service()
// fixme: allow specification of valid entity names
// maybe make this class abstract, so that the game can much easier implement the types?
export class EntityFactory<TEntityConfig> {
    private entityBlueprints: Record<string, EntityBlueprint> = {};
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
     * @param blueprints The blueprints to use.
     */
    public setEntityBlueprints(blueprints: Record<string, EntityBlueprint>) {
        this.entityBlueprints = blueprints;
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
