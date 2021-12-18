import { InjectSymbol } from "typed-ecstasy";

/**
 * GameConfig is just an example for a custom manual dependency.
 * This could, for example, be (or contain) an asset manager.
 * For the sake of this simple demo, one simple property will suffice.
 */
export type GameConfig = {
    defaultCameraFocusWeight: number;
};

// Notice how we also create and export a value here.
// This is required, so that it can be used in the dependency injection.
// If you have a class, this hack is not needed, since classes already have a type and a value.
export const GameConfig = InjectSymbol<GameConfig>("GameConfig");

// Same procedure for other types we want to be injectable:
export type GameContext2D = CanvasRenderingContext2D;
export const GameContext2D = InjectSymbol<GameContext2D>("GameContext2D");
