import { Component, registerComponent, PartialEntityConfig } from "typed-ecstasy";

// Check out SoundComponent for a more detailed explanation of how to declare components
export type TriggerAction =
    | {
          type: "score";
          value: number;
      }
    | {
          type: "removeSelf";
      }
    | {
          type: "removeOther";
      };

export type TriggerConfig = {
    actions: TriggerAction[];
};

export class TriggerComponent extends Component {
    public static readonly key = "Trigger";
    public static readonly unusedConfig: TriggerConfig;

    public actions!: TriggerAction[];
}

registerComponent(TriggerComponent, {
    build(comp, config) {
        comp.actions = config("actions", []);
    },
});

declare module "typed-ecstasy" {
    interface EntityConfig extends PartialEntityConfig<typeof TriggerComponent> {}
}

module.hot?.accept();
