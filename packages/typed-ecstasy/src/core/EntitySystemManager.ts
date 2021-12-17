import { Container, service } from "../di";
import type { EntitySystem } from "./EntitySystem";
import { AbstractSystemManager } from "./AbstractSystemManager";

/**
 * A manager for entity systems.
 */
@service("typed-ecstasy/EntitySystemManager")
export class EntitySystemManager extends AbstractSystemManager<EntitySystem> {
    // fixme: "useless" constructor currently needed, since we can't get "design:paramtypes" metadata without it.
    // ... maybe we can try using Object.getPrototypeOf to recursively find the first constructor that has metadata?
    // eslint-disable-next-line no-useless-constructor
    public constructor(container: Container) {
        super(container);
    }
}
