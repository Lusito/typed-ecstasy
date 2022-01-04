import { EntityFactory, ComponentBlueprint, Engine } from "typed-ecstasy";

import { blueprints } from "./blueprints";

type EntityConfigKey = keyof EntityConfig;

// This shows how you could set up an entity factory.
export function setupEntityFactory(engine: Engine) {
    // Create the entity factory itself
    const factory: EntityFactory<EntityConfig> = engine.container.get(EntityFactory);

    // Add all entity blueprints
    for (const name of Object.keys(blueprints)) {
        const entityConfig = blueprints[name];

        // An entity blueprint is essentially just an array of ComponentBlueprint objects.
        const entityBlueprint = Object.keys(entityConfig).map((key) => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const x = entityConfig[key as EntityConfigKey]!;
            return new ComponentBlueprint(key, x === true ? {} : x);
        });
        factory.addEntityBlueprint(name, entityBlueprint);
    }

    return factory;
}
