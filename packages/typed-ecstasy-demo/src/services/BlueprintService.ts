import { service, PostConstruct, EntityFactory } from "typed-ecstasy";

import * as blueprints from "../blueprints";

@service({ hot: module.hot })
export class BlueprintService {
    private readonly factory: EntityFactory<EntityConfig>;

    public constructor(factory: EntityFactory<EntityConfig>) {
        this.factory = factory;
    }

    protected [PostConstruct]() {
        this.factory.setEntityBlueprints(blueprints);
    }
}
