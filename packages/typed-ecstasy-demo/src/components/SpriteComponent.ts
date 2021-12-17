import { declareComponent } from "typed-ecstasy";

// Check out CameraFocusComponent for a more detailed explanation of how to declare components
export type SpriteData = {
    image: string;
    layer: number;
};

export type SpriteConfig = {
    image: string;
    layer?: number;
};

export const SpriteComponent = declareComponent("Sprite").withConfig<SpriteData, SpriteConfig>({
    build(comp, config) {
        comp.image = config("image", "notfound.png");
        comp.layer = config("layer", 1);
    },
});
