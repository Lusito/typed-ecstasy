import { Service } from "typedi";

import { AbstractSystemManager } from "../core/AbstractSystemManager";
import { SubSystem } from "./SubSystem";

/**
 * A manager for sub systems to be used with {@link SortedSubIteratingSystem}.
 */
@Service()
export class SubSystemManager extends AbstractSystemManager<SubSystem> {}
