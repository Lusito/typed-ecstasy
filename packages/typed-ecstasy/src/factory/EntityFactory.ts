/* eslint-disable dot-notation */
import { Engine } from "../core/Engine";
import type { ComponentType } from "../core/Component";
import { addMetaData } from "../di";
import { ComponentBlueprint } from "./ComponentBlueprint";

export type EntityBlueprint = ComponentBlueprint[];

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
 * @template TName The possible entity names.
 * @template TEntityConfig The entity configuration type.
 */
@addMetaData
export abstract class AbstractEntityFactory<TName extends string, TEntityConfig> {
    private entityBlueprints: Record<string, EntityBlueprint> = {};
    private readonly engine: Engine;

    /**
     * @param engine The engine to use.
     */
    protected constructor(engine: Engine) {
        this.engine = engine;
    }

    /**
     * Set the new blueprints to use.
     *
     * @param blueprints The blueprints to use.
     */
    protected setBlueprints(blueprints: Record<string, TEntityConfig>) {
        this.entityBlueprints = {};
        for (const name of Object.keys(blueprints)) {
            const config = blueprints[name];
            this.entityBlueprints[name] = Object.keys(config).map((key) => {
                let defaultValues = (config as Record<string, unknown>)[key];
                if (defaultValues === true) defaultValues = {};
                return new ComponentBlueprint(key, defaultValues as Record<string, unknown>);
            });
        }
    }

    /**
     * Creates and assembles an Entity.
     *
     * @param blueprintName The name of the entity blueprint.
     * @param overrides A map of overrides.
     * @returns A fully assembled Entity or null if the assembly failed.
     * @throws An exception if the entity could not be assembled.
     */
    public assemble(blueprintName: TName, overrides?: EntityConfigOverrides<TEntityConfig>) {
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
