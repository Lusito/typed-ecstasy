import { Service } from "typedi";

import type { EntitySystem } from "./EntitySystem";
import { AbstractSystemManager } from "./AbstractSystemManager";

/**
 * A manager for entity systems.
 */
@Service()
export class EntitySystemManager extends AbstractSystemManager<EntitySystem> {}
