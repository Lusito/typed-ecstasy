import { declareMarkerComponent, PartialEntityConfig } from "typed-ecstasy";

export const BallComponent = declareMarkerComponent("Ball");

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface EntityConfig extends PartialEntityConfig<typeof BallComponent> {}
}
