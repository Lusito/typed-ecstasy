/* eslint-disable dot-notation */
import { EntityComparator, SortedIteratingSystem } from "./SortedIteratingSystem";
import { SubSystemManager } from "../core/SubSystemManager";
import { Engine } from "../core/Engine";
import { Family } from "../core/Family";
import { Entity } from "../core/Entity";

/**
 * Imagine a SortedIteratingSystem that you can add SubSystems to.
 * For each entity being processed, all SubSystems that match the entities family will be called in the order they have been added.
 * An example use-case would be to do multiple render steps for each entity, while entities are ordered by a z-index.
 */
export class SortedSubIteratingSystem extends SortedIteratingSystem {
    public readonly subSystems: SubSystemManager;

    /**
     * @param engine The engine to use.
     * @param family The family of entities iterated over in this System.
     * @param comparator The comparator to sort the entities.
     * @param subSystems The SubSystemManager to use.
     */
    public constructor(engine: Engine, family: Family, comparator: EntityComparator, subSystems: SubSystemManager) {
        super(engine, family, comparator);
        this.subSystems = subSystems;
    }

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

    // fixme: make sure all subsystems get en-/disabled without actually changing the setting
    protected override onEnable() {
        super.onEnable();
        // this.subSystems.onEnable();
    }

    protected override onDisable() {
        super.onDisable();
        // this.subSystems.onDisable();
    }
}
