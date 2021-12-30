import { InjectSymbol } from "typed-ecstasy";

/**
 * GameAudioContext is just an example for a custom manual dependency.
 * You can add ad many as you like.
 */
export type GameAudioContext = {
    audioContext: AudioContext;
    sounds: {
        hitPaddle: AudioBuffer;
        hitWall: AudioBuffer;
        yellowExplosion: AudioBuffer;
        greenExplosion: AudioBuffer;
        orangeExplosion: AudioBuffer;
        redExplosion: AudioBuffer;
    };
};

// Notice how we also create and export a value here.
// This is required, so that it can be used in the dependency injection.
// If you have a class, this hack is not needed, since classes already have a type and a value.
export const GameAudioContext = InjectSymbol<GameAudioContext>("GameAudioContext");

// Same procedure for other types we want to be injectable:
export type GameContext2D = CanvasRenderingContext2D;
export const GameContext2D = InjectSymbol<GameContext2D>("GameContext2D");
