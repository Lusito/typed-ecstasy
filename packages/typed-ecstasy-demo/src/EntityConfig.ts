import type { InferEntityConfig } from "typed-ecstasy";

import type { BallComponent } from "./components/BallComponent";
import type { ColorComponent } from "./components/ColorComponent";
import type { CollidableComponent } from "./components/CollidableComponent";
import type { PositionComponent } from "./components/PositionComponent";
import type { SizeComponent } from "./components/SizeComponent";
import type { TriggerComponent } from "./components/TriggerComponent";
import type { VelocityComponent } from "./components/VelocityComponent";
import type { InputComponent } from "./components/InputComponent";
import type { SoundComponent } from "./components/SoundComponent";

/**
 * This detects all possible component configurations from the specified component types.
 */
export type EntityConfig = InferEntityConfig<
    | typeof PositionComponent
    | typeof VelocityComponent
    | typeof SizeComponent
    | typeof CollidableComponent
    | typeof ColorComponent
    | typeof TriggerComponent
    | typeof BallComponent
    | typeof InputComponent
    | typeof SoundComponent
>;
