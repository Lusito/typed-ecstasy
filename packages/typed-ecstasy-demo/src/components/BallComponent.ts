import { declareMarkerComponent, PartialEntityConfig } from "typed-ecstasy";

export const BallComponent = declareMarkerComponent("Ball");

// fixme: alternative to declare global: declare module 'typed-ecstasy'?
declare global {
    interface EntityConfig extends PartialEntityConfig<typeof BallComponent> {}
}
