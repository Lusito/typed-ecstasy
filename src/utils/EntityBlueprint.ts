import { ComponentBlueprint } from "./ComponentBlueprint";

/**
 * Stores a list of {@link ComponentBlueprint}s needed to construct an Entity.
 * See EntityFactory.
 */
export class EntityBlueprint {
    /** The component blueprints to use */
    public readonly components: ComponentBlueprint[] = [];

    /** @param blueprint shared_ptr to a ComponentBlueprint. */
    public add(blueprint: ComponentBlueprint) {
        this.components.push(blueprint);
    }
}
