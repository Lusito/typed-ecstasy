import { service } from "../di";
import type { EntitySystem } from "./EntitySystem";
import { AbstractSystemManager } from "./AbstractSystemManager";

/**
 * A manager for entity systems.
 */
@service("typed-ecstasy/EntitySystemManager")
export class EntitySystemManager extends AbstractSystemManager<EntitySystem> {
}
