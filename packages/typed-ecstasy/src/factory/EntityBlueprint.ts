import { ComponentBlueprint } from "./ComponentBlueprint";

export type EntityBlueprint = ComponentBlueprint[];

/**
 * Create an entity blueprint.
 *
 * @param config The components to use and their default configuration.
 * @returns An array of ComponentBlueprint.
 */
export function createEntityBlueprint<TConfig extends Record<string, any>>(config: TConfig): EntityBlueprint {
    return Object.keys(config).map((key) => {
        const x = config[key];
        return new ComponentBlueprint(key, x === true ? {} : x);
    });
}
