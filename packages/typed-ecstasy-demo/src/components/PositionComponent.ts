import { Component, registerComponent, PartialEntityConfig } from "typed-ecstasy";

// Check out SoundComponent for a more detailed explanation of how to declare components
export type PositionConfig = {
    x?: number;
    y?: number;
};

export class PositionComponent extends Component {
    public static readonly key = "Position";
    public static readonly unusedConfig: PositionConfig;

    public x!: number;
    public y!: number;
}

registerComponent(PositionComponent, {
    build(comp, config) {
        comp.x = config("x", 1);
        comp.y = config("y", 2);
    },
});

declare module "typed-ecstasy" {
    interface EntityConfig extends PartialEntityConfig<typeof PositionComponent> {}
}
