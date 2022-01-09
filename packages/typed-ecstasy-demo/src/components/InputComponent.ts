import { declareMarkerComponent, PartialEntityConfig } from "typed-ecstasy";

export const InputComponent = declareMarkerComponent("Input");

declare module "typed-ecstasy" {
    interface EntityConfig extends PartialEntityConfig<typeof InputComponent> {}
}
