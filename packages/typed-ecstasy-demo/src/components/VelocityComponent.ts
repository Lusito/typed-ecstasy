import { Component, registerComponent, PartialEntityConfig } from "typed-ecstasy";

// Check out SoundComponent for a more detailed explanation of how to declare components
export type VelocityConfig = {
    x?: number;
    y?: number;
};

export class VelocityComponent extends Component {
    public static readonly key = "Velocity";
    public static readonly unusedConfig: VelocityConfig;

    public x!: number;
    public y!: number;
}

registerComponent(VelocityComponent, {
    build(comp, config) {
        comp.x = config("x", 1);
        comp.y = config("y", 2);
    },
});

declare module "typed-ecstasy" {
    interface EntityConfig extends PartialEntityConfig<typeof VelocityComponent> {}
}
