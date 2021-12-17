import { EntityFactory, ComponentBlueprint, Allocator } from "typed-ecstasy";

import { blueprints } from "./blueprints";
import { componentFactories } from "./components/componentFactories";
import type { SampleContext, SampleEntityConfig } from "./types";

// This shows how you could set up an entity factory.
export function setupEntityFactory() {
    // Create the context instance to pass to all component factories
    const context: SampleContext = { defaultCameraFocusWeight: 1 };

    // Use PoolAllocator instead to use object pooling
    const allocator = new Allocator();

    // Create the entity factory itself
    const factory = new EntityFactory<SampleEntityConfig, SampleContext>(componentFactories, context, allocator);

    // Add all entity blueprints
    for (const name of Object.keys(blueprints)) {
        const entityConfig = blueprints[name];

        // An entity blueprint is essentially just an array of ComponentBlueprint objects.
        const entityBlueprint = Object.keys(entityConfig).map(
            // eslint-disable-next-line no-loop-func
            (key) => new ComponentBlueprint(key, entityConfig[key as keyof SampleEntityConfig])
        );
        factory.addEntityBlueprint(name, entityBlueprint);
    }

    return factory;
}
