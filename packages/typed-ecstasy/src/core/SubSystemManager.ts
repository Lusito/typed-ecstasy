import { service } from "../di";
import { AbstractSystemManager } from "./AbstractSystemManager";
import { SubSystem } from "./SubSystem";

/**
 * A manager for sub systems to be used with {@link SortedSubIteratingSystem}.
 */
@service("typed-ecstasy/SubSystemManager", { transient: true })
export class SubSystemManager extends AbstractSystemManager<SubSystem> {}
