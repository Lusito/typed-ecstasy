import { declareMarkerComponent, PartialEntityConfig } from "typed-ecstasy";

export const InputComponent = declareMarkerComponent("Input");

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface EntityConfig extends PartialEntityConfig<typeof InputComponent> {}
}
