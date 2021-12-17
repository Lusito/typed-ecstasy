import { EntityFactory, ComponentBlueprint, Engine } from "typed-ecstasy";

import { blueprints } from "./blueprints";
import type { EntityConfig } from "./EntityConfig";

// This shows how you could set up an entity factory.
export function setupEntityFactory(engine: Engine) {
    // Create the entity factory itself
    const factory = new EntityFactory<EntityConfig>(engine);

    // Add all entity blueprints
    for (const name of Object.keys(blueprints)) {
        const entityConfig = blueprints[name];

        // An entity blueprint is essentially just an array of ComponentBlueprint objects.
        const entityBlueprint = Object.keys(entityConfig).map(
            // eslint-disable-next-line no-loop-func, @typescript-eslint/no-non-null-assertion
            (key) => new ComponentBlueprint(key, entityConfig[key as keyof EntityConfig]!)
        );
        factory.addEntityBlueprint(name, entityBlueprint);
    }

    return factory;
}
