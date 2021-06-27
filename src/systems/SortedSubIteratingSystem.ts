/* eslint-disable dot-notation */
import { Inject } from "typedi";

import { Entity } from "../core/Entity";
import { SortedIteratingSystem } from "./SortedIteratingSystem";
import { SubSystemManager } from "./SubSystemManager";

/**
 * Imagine a SortedIteratingSystem that you can add SubSystems to.
 * For each entity being processed, all SubSystems that match the entities family will be called in the order they have been added.
 * An example use-case would be to do multiple render steps for each entity, while entities are ordered by a z-index.
 */
export class SortedSubIteratingSystem extends SortedIteratingSystem {
    @Inject()
    public readonly subSystems!: SubSystemManager;

    public override processEntity(entity: Entity, deltaTime: number) {
        for (const system of this.subSystems.getAll()) {
            if (system.isEnabled() && system.family.matches(entity)) {
                system.processEntity(entity, deltaTime);
            }
        }
    }

    public override update(deltaTime: number) {
        if (this.subSystems.hasEnabledSystems()) {
            this.subSystems["delayOperations"] = true;
            super.update(deltaTime);
            this.subSystems["delayOperations"] = false;
        }
    }
}
