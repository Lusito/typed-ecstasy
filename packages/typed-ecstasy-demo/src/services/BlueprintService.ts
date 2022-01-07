import { service, PostConstruct, PreDestroy, EntityFactory, ComponentBlueprint } from "typed-ecstasy";

import { blueprints } from "../blueprints";

type EntityConfigKey = keyof EntityConfig;

@service({ hot: module.hot })
export class BlueprintService {
    private readonly factory: EntityFactory<EntityConfig>;

    public constructor(factory: EntityFactory<EntityConfig>) {
        this.factory = factory;
    }

    protected [PostConstruct]() {
        // Add all entity blueprints
        for (const name of Object.keys(blueprints)) {
            const entityConfig = blueprints[name];

            // An entity blueprint is essentially just an array of ComponentBlueprint objects.
            const entityBlueprint = Object.keys(entityConfig).map((key) => {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const x = entityConfig[key as EntityConfigKey]!;
                return new ComponentBlueprint(key, x === true ? {} : x);
            });
            this.factory.addEntityBlueprint(name, entityBlueprint);
        }
    }

    protected [PreDestroy]() {
        this.factory.reset();
    }
}
