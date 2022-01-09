import { service, PostConstruct, AbstractEntityFactory } from "typed-ecstasy";

import * as blueprints from "../blueprints";

export type EntityName = keyof typeof blueprints;

@service({ hot: module.hot })
export class EntityFactory extends AbstractEntityFactory<EntityName> {
    protected [PostConstruct]() {
        this.setBlueprints(blueprints);
    }
}
