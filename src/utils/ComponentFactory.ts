import { ComponentBlueprint } from "./ComponentBlueprint";
import { Entity } from "../core/Entity";

/**
 * Component factory interface. Used to construct {@link Component}s from {@link ComponentBlueprint}s.
 */
export abstract class ComponentFactory {
    /**
     * Create a Component based on the blueprint and add it to the Entity.
     *
     * @param entity the Entity to add the Component to.
     * @param blueprint the blueprint
     * @return true on success.
     */
    public abstract assemble(entity: Entity, blueprint: ComponentBlueprint): boolean;
}
