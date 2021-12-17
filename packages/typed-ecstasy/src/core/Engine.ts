/* eslint-disable dot-notation */
import { Container, setHotSwapListener } from "../di";
import { EntitySystemManager } from "./EntitySystemManager";
import { AbstractSystem } from "./AbstractSystem";
import { EntityManager } from "./EntityManager";
import { Allocator } from "./Allocator";

setHotSwapListener<boolean>({
    beforeHotSwap(target) {
        if (target instanceof AbstractSystem) {
            const enabled = target.isEnabled();
            target.setEnabled(false);
            return enabled;
        }
        return false;
    },
    afterHotSwap(target, enabled) {
        if (target instanceof AbstractSystem) {
            target.setEnabled(enabled);
        }
    },
});

/**
 * The heart of the Entity framework. It is responsible for keeping track of entities and systems.
 * The engine should be updated every tick via the {@link update} method.
 */
export class Engine {
    public readonly allocator: Allocator;

    public readonly container = Container.create();

    public readonly systems: EntitySystemManager;

    public readonly entities: EntityManager;

    private updating = false;

    /**
     * Creates a new Engine.
     *
     * @param allocator The optional allocator to use for creating entities & components.
     */
    public constructor(allocator: Allocator = new Allocator()) {
        this.allocator = allocator;
        this.entities = new EntityManager(allocator);
        this.container.set(Engine, this);
        this.container.set(Container, this.container);
        this.container.set(Allocator, allocator);
        this.systems = this.container.get(EntitySystemManager);
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
}
