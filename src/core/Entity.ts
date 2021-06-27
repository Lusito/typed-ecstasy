/* eslint-disable dot-notation */
import { Bits, ReadonlyBits } from "../utils/Bits";
import { Component, ComponentConstructor } from "./Component";
import type { EntityManager } from "./EntityManager";

/**
 * Simple containers of {@link Component Components}, which give an entity data.
 */
export class Entity {
    /** A flag that can be used to bit mask this entity. Up to the user to manage. */
    public flags = 0;

    protected uuid = 0;

    protected scheduledForRemoval = false;

    private readonly componentsByClass = new Map<ComponentConstructor, Component>();

    private readonly components: Component[] = [];

    private readonly componentBits = new Bits();

    private readonly familyBits = new Bits();

    protected manager: EntityManager | null = null;

    /** @returns The Entity's unique id. */
    public getId() {
        return this.uuid;
    }

    /** @returns True if the entity is scheduled to be removed. */
    public isScheduledForRemoval() {
        return this.scheduledForRemoval;
    }

    /** Remove this entity from its engine. */
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
     * @param clazz The Component class.
     */
    public remove(clazz: ComponentConstructor) {
        if (this.manager) this.manager["delayedOperations"].removeComponent(this, clazz);
        else this.removeInternal(clazz);
    }

    /** Removes all the {@link Component Components} from the Entity. */
    public removeAll() {
        if (this.manager) this.manager["delayedOperations"].removeAllComponents(this);
        else this.removeAllInternal();
    }

    /** @returns A list with all the {@link Component Components} of this Entity. */
    public getAll() {
        return this.components;
    }

    /**
     * Retrieve a Component from this Entity by class.
     *
     * @template T The component class.
     * @param clazz The Component class.
     * @returns The instance of the specified Component attached to this Entity, or undefined if no such Component exists.
     */
    public get<T extends Component>(clazz: ComponentConstructor<T>) {
        return this.componentsByClass.get(clazz) as T | undefined;
    }

    /**
     * Require a Component from this Entity by class.
     *
     * @template T The component class.
     * @param clazz The Component class.
     * @returns The instance of the specified Component attached to this Entity.
     * @throws If the component doesn't exist on this entity.
     */
    public require<T extends Component>(clazz: ComponentConstructor<T>) {
        const component = this.componentsByClass.get(clazz);
        if (!component) throw new Error(`Component ${clazz.name} does not exist on entity ${this.uuid}`);
        return component as T;
    }

    /**
     * @param clazz The Component class.
     * @returns Whether or not the Entity has a Component for the specified class.
     */
    public has(clazz: ComponentConstructor) {
        return this.componentBits.get(clazz.getComponentBit());
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected addInternal(component: Component) {
        const clazz = component.getComponentClass();
        const oldComponent = this.componentsByClass.get(clazz);
        if (component === oldComponent) return false;

        if (oldComponent) this.removeInternal(clazz);

        this.componentsByClass.set(clazz, component);
        this.components.push(component);

        this.componentBits.set(clazz.getComponentBit());
        return true;
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected removeInternal(clazz: ComponentConstructor) {
        const component = this.componentsByClass.get(clazz);
        if (component) {
            this.componentsByClass.delete(clazz);

            const index2 = this.components.indexOf(component);
            this.components.splice(index2, 1);
            this.componentBits.clear(clazz.getComponentBit());
        }
        return component;
    }

    // eslint-disable-next-line jsdoc/require-jsdoc
    protected removeAllInternal() {
        if (this.components.length) {
            this.componentsByClass.clear();
            this.components.length = 0;
            this.componentBits.clearAll();
            return true;
        }
        return false;
    }

    /** @returns This Entity's Component bits, describing all the {@link Component Components} it contains. */
    public getComponentBits(): ReadonlyBits {
        return this.componentBits;
    }

    /** @returns This Entity's Family bits, describing all the {@link Family Families} it belongs to. */
    public getFamilyBits(): ReadonlyBits {
        return this.familyBits;
    }
}
