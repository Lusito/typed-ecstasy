import { InjectSymbol } from "typed-ecstasy";

export interface GameSound {
    key: GameSoundKey;
    path: string;
    buffer: AudioBuffer;
}

/**
 * GameSounds is just an example for a custom manual dependency.
 * You can add ad many as you like.
 */
export type GameSounds = {
    hitPaddle: GameSound;
    hitWall: GameSound;
    yellowExplosion: GameSound;
    greenExplosion: GameSound;
    orangeExplosion: GameSound;
    redExplosion: GameSound;
};

// Notice how we also create and export a value here.
// This is required, so that it can be used in the dependency injection.
// If you have a class, this hack is not needed, since classes already have a type and a value.
export const GameSounds = InjectSymbol<GameSounds>("GameSounds");

export type GameSoundKey = keyof GameSounds;

// Same procedure for other types we want to be injectable:
export type GameContext2D = CanvasRenderingContext2D;
export const GameContext2D = InjectSymbol<GameContext2D>("GameContext2D");

// Since we need the above constants to be unique and never be recreated, we'll add a guard here for HMR:
if (module.hot) {
    module.hot.dispose(() => {
        window.location.reload();
    });
}
