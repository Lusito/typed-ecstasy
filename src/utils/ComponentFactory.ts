import { ComponentBlueprint } from "./ComponentBlueprint";
import { Entity } from "../core/Entity";
import { Constructor } from "./Constructor";
import type { Component } from "../core/Component";

/**
 * A component factory creates a Component based on the blueprint and adds it to the Entity.
 *
 * @param entity the Entity to add the Component to.
 * @param blueprint the blueprint
 * @return true on success.
 */
export type ComponentFactory = (entity: Entity, blueprint: ComponentBlueprint) => boolean;

/**
 * Create a template ComponentFactory implementation for simple components,
 * which don't need to read data from the blueprint.
 */
export function simpleComponentFactory(ComponentClass: Constructor<Component>) {
    return (entity: Entity) => !!entity.add(new ComponentClass());
}
