import { declareComponent, PartialEntityConfig } from "typed-ecstasy";

// Check out SoundComponent for a more detailed explanation of how to declare components
export type CollidableData = {
    restitution: number;
    impactControlX: number;
};

export type CollidableConfig = {
    restitution?: number;
    impactControlX?: number;
};

export const CollidableComponent = declareComponent("Collidable").withConfig<CollidableData, CollidableConfig>({
    build(comp, config) {
        comp.restitution = config("restitution", 1);
        comp.impactControlX = config("impactControlX", 0);
    },
});

declare module "typed-ecstasy" {
    interface EntityConfig extends PartialEntityConfig<typeof CollidableComponent> {}
}
