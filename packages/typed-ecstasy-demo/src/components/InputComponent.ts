import { Component, PartialEntityConfig, registerComponent } from "typed-ecstasy";

export class InputComponent extends Component {
    public static readonly key = "Input";
}

registerComponent(InputComponent, {});

declare module "typed-ecstasy" {
    interface EntityConfig extends PartialEntityConfig<typeof InputComponent> {}
}

module.hot?.accept();
