import { declareComponent, PartialEntityConfig } from "typed-ecstasy";

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
export type TriggerData = {
    actions: TriggerAction[];
};

export type TriggerConfig = TriggerData;

export const TriggerComponent = declareComponent("Trigger").withConfig<TriggerData, TriggerConfig>({
    build(comp, config) {
        comp.actions = config("actions", []);
    },
});

declare module "typed-ecstasy" {
    interface EntityConfig extends PartialEntityConfig<typeof TriggerComponent> {}
}
