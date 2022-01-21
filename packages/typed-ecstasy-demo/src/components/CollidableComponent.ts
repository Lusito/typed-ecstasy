import { registerComponent, PartialEntityConfig, Component } from "typed-ecstasy";

// Check out SoundComponent for a more detailed explanation of how to declare components
export type CollidableConfig = {
    restitution?: number;
    impactControlX?: number;
};

export class CollidableComponent extends Component {
    public static readonly key = "Collidable";
    public static readonly unusedConfig: CollidableConfig;

    public restitution!: number;
    public impactControlX!: number;
}

registerComponent(CollidableComponent, {
    build(comp, config) {
        comp.restitution = config("restitution", 1);
        comp.impactControlX = config("impactControlX", 0);
    },
});

declare module "typed-ecstasy" {
    interface EntityConfig extends PartialEntityConfig<typeof CollidableComponent> {}
}
