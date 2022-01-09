import { declareMarkerComponent, PartialEntityConfig } from "typed-ecstasy";

export const BallComponent = declareMarkerComponent("Ball");

declare module "typed-ecstasy" {
    interface EntityConfig extends PartialEntityConfig<typeof BallComponent> {}
}
