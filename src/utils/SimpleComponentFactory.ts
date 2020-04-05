import { Constructor } from "./Constructor";
import { Entity } from "../core/Entity";
import { Component } from "../core/Component";
import { ComponentFactory } from "./ComponentFactory";

/**
 * A template ComponentFactory implementation for simple components
 * which don't need to read data from the blueprint.
 */
export class SimpleComponentFactory extends ComponentFactory {
    private componentClass: Constructor<Component>;

    /** Default constructor */
    public constructor(componentClass: Constructor<Component>) {
        super();
        this.componentClass = componentClass;
    }

    /**
     * Assemble a component for an entity.
     *
     * @param entity the entity to add the component to
     */
    public assemble(entity: Entity) {
        // eslint-disable-next-line new-cap
        return !!entity.add(new this.componentClass());
    }
}
