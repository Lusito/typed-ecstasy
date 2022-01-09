import { declareMarkerComponent, PartialEntityConfig } from "typed-ecstasy";

export const InputComponent = declareMarkerComponent("Input");

declare global {
    interface EntityConfig extends PartialEntityConfig<typeof InputComponent> {}
}
