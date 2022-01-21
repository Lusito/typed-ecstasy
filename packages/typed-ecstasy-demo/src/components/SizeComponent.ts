import { Component, PartialEntityConfig, registerComponent } from "typed-ecstasy";

// Check out SoundComponent for a more detailed explanation of how to declare components
export type SizeConfig = {
    width?: number;
    height?: number;
};

export class SizeComponent extends Component {
    public static readonly key = "Size";
    public static readonly unusedConfig: SizeConfig;

    public width!: number;
    public height!: number;
}

registerComponent(SizeComponent, {
    build(comp, config) {
        comp.width = config("width", 0);
        comp.height = config("height", 0);
    },
});

declare module "typed-ecstasy" {
    interface EntityConfig extends PartialEntityConfig<typeof SizeComponent> {}
}
