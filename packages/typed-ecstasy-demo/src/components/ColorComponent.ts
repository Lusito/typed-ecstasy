import { Component, PartialEntityConfig, registerComponent } from "typed-ecstasy";

// Check out SoundComponent for a more detailed explanation of how to declare components
export type ColorConfig = {
    color: string;
    layer?: number;
};

export class ColorComponent extends Component {
    public static readonly key = "Color";
    public static readonly unusedConfig: ColorConfig;

    public color!: string;
    public layer!: number;
}

registerComponent(ColorComponent, {
    build(comp, config) {
        comp.color = config("color", "pink");
        comp.layer = config("layer", 1);
    },
});

declare module "typed-ecstasy" {
    interface EntityConfig extends PartialEntityConfig<typeof ColorComponent> {}
}

module.hot?.accept();
