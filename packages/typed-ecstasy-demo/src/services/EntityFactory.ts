import { service, PostConstruct, AbstractEntityFactory } from "typed-ecstasy";

import * as blueprints from "../blueprints";

export type EntityNames = keyof typeof blueprints;

@service({ hot: module.hot })
export class EntityFactory extends AbstractEntityFactory<EntityNames, EntityConfig> {
    protected [PostConstruct]() {
        this.setBlueprints(blueprints);
    }
}
