/* eslint-disable dot-notation */
import { Component, ComponentClass } from "./Component";
import type { EntityManager, FamilyMeta } from "./EntityManager";

/**
 * A reference to an entity. It becomes invalid once the entity has been removed.
 */
export interface EntityRef {
    /** @returns The entity or undefined if no longer valid. */
    deref(): Entity | undefined;
}

/**
 * Simple containers of components, which give an entity data.
 */
export class Entity {
    /** A flag that can be used to bit mask this entity. Up to the user to manage. */
    public flags = 0;

    protected uuid = 0;

    protected scheduledForRemoval = false;

    private readonly componentsById: Array<Component | undefined> = [];

    protected readonly familyMeta = new Set<FamilyMeta>();

    protected manager: EntityManager | null = null;

    /** @returns The Entity's unique id. */
    public getId() {
        return this.uuid;
    }

    /** @returns True if the entity is scheduled to be removed. */
    public isScheduledForRemoval() {
        return this.scheduledForRemoval;
    }

    /** Remove this entity from its manager. */
    public destroy() {
        this.manager?.remove(this);
    }

    /**
     * Add a component.
     *
     * @template T The component class.
     * @param component The component to add.
     * @returns The added component.
     */
    public add<T extends Component>(component: T) {
        if (this.manager) this.manager["delayedOperations"].addComponent(this, component);
        else this.addInternal(component);
        return component;
    }

    /**
     * Removes the Component of the specified type. Since there is only ever one Component of one type, we don't
     * need an instance reference.
     *
     * @param Class The Component class.
     */
    public remove(Class: ComponentClass) {
        if (this.manager) this.manager["delayedOperations"].removeComponent(this, Class.id);
        else this.removeInternal(Class.id);
    }

    /** Removes all the {@link Component Components} from the Entity. */
    public removeAll() {
        if (this.manager) this.manager["delayedOperations"].removeAllComponents(this);
        else this.removeAllInternal();
    }

    /** @returns A list with all the {@link Component Components} of this Entity. Each component sits at its own index, so some slots may be empty. */
    public getAll() {
        return this.componentsById;
    }

    /**
     * Retrieve a Component from this Entity by class.
     *
     * @template T The component data type. Do not specify manually.
     * @param Class The Component class.
     * @returns The instance of the specified Component attached to this Entity, or undefined if no such Component exists.
     */
    public get<T extends Component>(Class: ComponentClass<any, T>) {
        return this.componentsById[Class.id] as T | undefined;
    }

    /**
     * Require a Component from this Entity by class.
     *
     * @template T The component class type. Do not specify manually.
     * @param Class The Component class.
     * @returns The instance of the specified Component attached to this Entity.
     * @throws If the component doesn't exist on this entity.
     */
    public require<T extends Component>(Class: ComponentClass<any, T>) {
        const component = this.componentsById[Class.id];
        if (!component) throw new Error(`Component ${Class.key} does not exist on entity ${this.uuid}`);
        return component as T;
    }

    /**
     * @param Class The Component class.
     * @returns Whether or not the Entity has a Component for the specified class.
     */
    public has(Class: ComponentClass) {
        return !!this.componentsById[Class.id];
    }

    /**
     * @internal
     * @param component The component data to add.
     */
    protected addInternal(component: Component) {
        const { id } = component.constructor as ComponentClass;
        const oldComponent = this.componentsById[id];
        if (component !== oldComponent) {
            if (oldComponent) this.removeInternal(id);

            this.componentsById[id] = component;
        }
    }

    /**
     * @internal
     * @param id The component id to remove.
     * @returns The removed component data.
     */
    protected removeInternal(id: number) {
        const component = this.componentsById[id];
        if (component) {
            delete this.componentsById[id];
        }
        return component;
    }

    /** @internal */
    protected removeAllInternal() {
        this.componentsById.length = 0;
    }

    /**
     * @returns A reference to this entity.
     */
    public createRef(): EntityRef {
        const ref = new WeakRef(this);
        const { uuid } = this;
        return {
            deref() {
                const entity = ref.deref();
                if (!entity || entity.scheduledForRemoval || entity.uuid !== uuid) return undefined;
                return entity;
            },
        };
    }
}
