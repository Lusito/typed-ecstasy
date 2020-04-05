import { EntityBlueprint } from "./EntityBlueprint";
import { ComponentFactory } from "./ComponentFactory";
import { Entity } from "../core/Entity";

/**
 * A factory to create {@link Entity entities} from blueprints.
 */
export class EntityFactory {
    private componentFactories: { [s: string]: ComponentFactory } = {};

    private entities: { [s: string]: EntityBlueprint } = {};

    /**
     * Add a component factory
     *
     * @param name the name used to identify a Component
     * @param factory the factory to use
     */
    public addComponentFactory(name: string, factory: ComponentFactory) {
        this.componentFactories[name] = factory;
    }

    /**
     * @param name the name used to identify the EntityBlueprint
     * @param blueprint the blueprint
     */
    public addEntityBlueprint(name: string, blueprint: EntityBlueprint) {
        this.entities[name] = blueprint;
    }

    /**
     * Add all {@link Component}s found in a blueprint to the supplied entity.
     *
     * @param entity the entity to add the {@link Component}s to.
     * @param blueprintname the name used to identify the EntityBlueprint
     * @return true on success.
     */
    public assemble(entity: Entity, blueprintname: string, overrides?: { [s: string]: { [s: string]: any } }) {
        const blueprint = this.entities[blueprintname];
        let success = false;
        if (blueprint) {
            success = true;
            for (const componentBlueprint of blueprint.components) {
                const factory = this.componentFactories[componentBlueprint.name];
                componentBlueprint.setOverrides(overrides?.[componentBlueprint.name]);
                if (!factory || !factory.assemble(entity, componentBlueprint)) {
                    success = false;
                    console.error(`Could not assemble component ${componentBlueprint.name}`);
                }
                componentBlueprint.setOverrides();
            }
        }
        return success;
    }
}
