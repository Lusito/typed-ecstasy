/* eslint-disable dot-notation */
import { Engine } from "../core/Engine";
import type { ComponentClassWithConfig, ComponentClass } from "../core/Component";
import { addMetaData } from "../di";
import { ComponentBlueprint } from "./ComponentBlueprint";
import type { EntityConfig } from "..";

export type EntityBlueprint = ComponentBlueprint[];

export type PartialEntityConfig<T extends ComponentClass<any, any>> = T extends ComponentClassWithConfig<
    infer TName,
    any,
    infer TConfig
>
    ? Partial<Record<TName, TConfig>>
    : T extends ComponentClass<infer TName, any>
    ? Partial<Record<TName, true>>
    : never;

/**
 * An object with overrides for each component.
 */
export type EntityConfigOverrides = {
    [P in keyof EntityConfig]?: Partial<EntityConfig[P]>;
};

/**
 * A factory to assemble {@link Entity entities} from blueprints.
 *
 * @template TName The possible entity names.
 */
@addMetaData
export abstract class AbstractEntityFactory<TName extends string> {
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
    protected setBlueprints(blueprints: Record<string, EntityConfig>) {
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
    public assemble(blueprintName: TName, overrides?: EntityConfigOverrides) {
        const entity = this.engine.obtainEntity();
        try {
            const blueprint = this.entityBlueprints[blueprintName];
            if (!blueprint) throw new Error(`Could not find entity blueprint for '${blueprintName}'`);

            for (const componentBlueprint of blueprint) {
                // eslint-disable-next-line prefer-destructuring
                const meta = componentBlueprint["meta"];
                // Skip blueprints, where the component is not used in code
                if (!meta) continue;

                componentBlueprint["setOverrides"](overrides?.[meta.key as keyof EntityConfigOverrides]);
                const component = this.engine.obtainComponent(
                    meta.class as ComponentClassWithConfig<any, any, any>,
                    componentBlueprint.get
                );
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
