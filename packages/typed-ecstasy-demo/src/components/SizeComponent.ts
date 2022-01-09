import { declareComponent, PartialEntityConfig } from "typed-ecstasy";

// Check out SoundComponent for a more detailed explanation of how to declare components
export type SizeData = {
    width: number;
    height: number;
};

export type SizeConfig = Partial<SizeData>;

export const SizeComponent = declareComponent("Size").withConfig<SizeData, SizeConfig>({
    build(comp, config) {
        comp.width = config("width", 0);
        comp.height = config("height", 0);
    },
});

declare module "typed-ecstasy" {
    interface EntityConfig extends PartialEntityConfig<typeof SizeComponent> {}
}
