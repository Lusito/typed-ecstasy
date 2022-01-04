import { declareComponent, PartialEntityConfig } from "typed-ecstasy";

// Check out SoundComponent for a more detailed explanation of how to declare components
export type CollidableData = {
    restitution: number;
    impactControlX: number;
    // impactControlY: number;
};

export type CollidableConfig = {
    restitution?: number;
    impactControlX?: number;
    // impactControlY?: number;
};

export const CollidableComponent = declareComponent("Collidable").withConfig<CollidableData, CollidableConfig>({
    build(comp, config) {
        comp.restitution = config("restitution", 1);
        comp.impactControlX = config("impactControlX", 0);
        // comp.impactControlY = config("impactControlY", 0);
    },
});

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface EntityConfig extends PartialEntityConfig<typeof CollidableComponent> {}
}
