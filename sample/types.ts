import type { PositionConfig } from "./components/PositionComponent";
import type { SpriteConfig } from "./components/SpriteComponent";
import type { PickupConfig } from "./components/PickupComponent";
import type { CameraFocusConfig } from "./components/CameraFocusComponent";

/**
 * We need a type to define the possible composition of an entity.
 * In other words, what components an entity might have and what values should be used for the component configurations.
 */
export type SampleEntityConfig = {
    // The keys here will be used when setting up the component factories.
    Position?: PositionConfig;
    Sprite?: SpriteConfig;
    Pickup?: PickupConfig;
    CameraFocus?: CameraFocusConfig;
};

/**
 * Context is a custom object that can be passed to the component factories (as a second parameter).
 * This could, for example, be (or contain) an asset manager.
 * For the sake of this simple demo, one simple property will suffice.
 */
export type SampleContext = {
    defaultCameraFocusWeight: number;
};
