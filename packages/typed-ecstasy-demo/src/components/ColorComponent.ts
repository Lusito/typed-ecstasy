import { declareComponent } from "typed-ecstasy";

// Check out SoundComponent for a more detailed explanation of how to declare components
export type ColorData = {
    color: string;
    layer: number;
};

export type ColorConfig = {
    color: string;
    layer?: number;
};

export const ColorComponent = declareComponent("Color").withConfig<ColorData, ColorConfig>({
    build(comp, config) {
        comp.color = config("color", "pink");
        comp.layer = config("layer", 1);
    },
});
