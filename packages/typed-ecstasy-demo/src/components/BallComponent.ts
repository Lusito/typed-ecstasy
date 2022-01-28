import { Component, PartialEntityConfig, registerComponent } from "typed-ecstasy";

export class BallComponent extends Component {
    public static readonly key = "Ball";
}

registerComponent(BallComponent, {});

declare module "typed-ecstasy" {
    interface EntityConfig extends PartialEntityConfig<typeof BallComponent> {}
}

module.hot?.accept();
