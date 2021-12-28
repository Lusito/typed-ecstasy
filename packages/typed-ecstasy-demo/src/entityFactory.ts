import { EntityFactory, ComponentBlueprint, Engine } from "typed-ecstasy";

import { blueprints } from "./blueprints";
import type { EntityConfig } from "./EntityConfig";

// This shows how you could set up an entity factory.
export function setupEntityFactory(engine: Engine) {
    // Create the entity factory itself
    const factory: EntityFactory<EntityConfig> = engine.container.get(EntityFactory);

    // Add all entity blueprints
    for (const name of Object.keys(blueprints)) {
        const entityConfig = blueprints[name];

        // An entity blueprint is essentially just an array of ComponentBlueprint objects.
        const entityBlueprint = Object.keys(entityConfig).map((key) => {
            // eslint-disable-next-line no-loop-func, @typescript-eslint/no-non-null-assertion
            const x = entityConfig[key as keyof EntityConfig]!;
            return new ComponentBlueprint(key, x === true ? {} : x);
        });
        factory.addEntityBlueprint(name, entityBlueprint);
    }

    return factory;
}
