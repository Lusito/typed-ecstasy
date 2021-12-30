import { declareComponent } from "typed-ecstasy";

// Check out SoundComponent for a more detailed explanation of how to declare components
export type VelocityData = {
    x: number;
    y: number;
};

export type VelocityConfig = {
    x?: number;
    y?: number;
};

export const VelocityComponent = declareComponent("Velocity").withConfig<VelocityData, VelocityConfig>({
    build(comp, config) {
        comp.x = config("x", 1);
        comp.y = config("y", 2);
    },
});
