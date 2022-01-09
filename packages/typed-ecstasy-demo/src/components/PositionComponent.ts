import { declareComponent, PartialEntityConfig } from "typed-ecstasy";

// Check out SoundComponent for a more detailed explanation of how to declare components
export type PositionData = {
    x: number;
    y: number;
};

export type PositionConfig = Partial<PositionData>;

export const PositionComponent = declareComponent("Position").withConfig<PositionData, PositionConfig>({
    build(comp, config) {
        comp.x = config("x", 1);
        comp.y = config("y", 2);
    },
});

declare global {
    interface EntityConfig extends PartialEntityConfig<typeof PositionComponent> {}
}
