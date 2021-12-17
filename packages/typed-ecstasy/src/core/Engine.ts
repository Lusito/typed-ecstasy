/* eslint-disable dot-notation */
import { Container, ContainerInstance } from "typedi";

import { Allocator } from "./Allocator";
import { EntityManager } from "./EntityManager";
import { EntitySystemManager } from "./EntitySystemManager";

let engineCounter = 0;

/**
 * The heart of the Entity framework. It is responsible for keeping track of entities and systems.
 * The engine should be updated every tick via the {@link update} method.
 */
export class Engine {
    private container = Container.of(`ecstasy-engine-${engineCounter++}`);

    public readonly systems = new EntitySystemManager(this.container);

    public readonly entities: EntityManager;

    private updating = false;

    /**
     * Creates a new Engine.
     *
     * @param allocator The optional allocator to use for creating entities & components.
     */
    public constructor(allocator: Allocator = new Allocator()) {
        this.entities = new EntityManager(this, allocator);
        this.container.set(Engine, this);
        this.container.set(ContainerInstance, this.container);
        this.container.set(Allocator, allocator);
    }

    /**
     * @returns True if this engine is currently updating systems.
     */
    public isUpdating() {
        return this.updating;
    }

    /**
     * Updates all the systems in this Engine.
     *
     * @param deltaTime The time passed since the last frame.
     */
    public update(deltaTime: number) {
        this.updating = true;

        if (this.systems.hasEnabledSystems()) {
            this.entities["delayOperations"] = true;
            this.systems["delayOperations"] = true;
            for (const system of this.systems.getAll()) {
                if (system.isEnabled()) system.update(deltaTime);

                this.entities["delayedOperations"].processDelayedOperations();
            }
            this.entities["delayOperations"] = false;
            this.systems["delayOperations"] = false;
        }
        this.updating = false;
    }

    /**
     * @returns The IOC Container (currently using typedi).
     */
    public getContainer() {
        return this.container;
    }
}
