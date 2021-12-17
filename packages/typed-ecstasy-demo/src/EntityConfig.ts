import type { InferEntityConfig } from "typed-ecstasy";

import type { CameraFocusComponent } from "./components/CameraFocusComponent";
import type { PickupComponent } from "./components/PickupComponent";
import type { PositionComponent } from "./components/PositionComponent";
import type { SpriteComponent } from "./components/SpriteComponent";
import type { VelocityComponent } from "./components/VelocityComponent";

/**
 * This detects all possible component configurations from the specified component types.
 */
export type EntityConfig = InferEntityConfig<
    | typeof CameraFocusComponent
    | typeof PickupComponent
    | typeof PositionComponent
    | typeof SpriteComponent
    | typeof VelocityComponent
>;
