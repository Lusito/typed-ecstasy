import { InjectSymbol, PostConstruct, retainable, service } from "typed-ecstasy";
import yellowExplosionUrl from "url:../sounds/explosion_yellow.wav";
import greenExplosionUrl from "url:../sounds/explosion_green.wav";
import orangeExplosionUrl from "url:../sounds/explosion_orange.wav";
import redExplosionUrl from "url:../sounds/explosion_red.wav";
import hitPaddleUrl from "url:../sounds/hit_paddle.wav";
import hitWallUrl from "url:../sounds/hit_wall.wav";

export interface GameSound {
    key: GameSoundKey;
    path: string;
    buffer: AudioBuffer;
}

/**
 * GameSounds is just an example for a custom manually set dependency.
 * You can add as many as you like.
 */
export type GameSounds = {
    hitPaddle: GameSound;
    hitWall: GameSound;
    yellowExplosion: GameSound;
    greenExplosion: GameSound;
    orangeExplosion: GameSound;
    redExplosion: GameSound;
};

// Notice how we also create and export a value here (with the same name as the type above).
// This is required, so that it can be used in the dependency injection.
// If you have a class, this hack is not needed, since classes already have a type and a value.
export const GameSounds = InjectSymbol<GameSounds>("GameSounds");

export type GameSoundKey = keyof GameSounds;

type GameSoundPaths = { [P in GameSoundKey]: string };

const paths: GameSoundPaths = {
    hitPaddle: hitPaddleUrl,
    hitWall: hitWallUrl,
    yellowExplosion: yellowExplosionUrl,
    greenExplosion: greenExplosionUrl,
    orangeExplosion: orangeExplosionUrl,
    redExplosion: redExplosionUrl,
};

const pathKeys = Object.keys(paths) as GameSoundKey[];

/**
 * By using the import "url:..."" feature from parcel, we can actually use HMR for binary file updates as well!
 *
 * This Service makes use of this by reloading sounds when the path changed.
 */
@service({ hot: module.hot })
export class AssetService {
    private readonly audioContext: AudioContext;
    @retainable
    private instance = 0;

    @retainable
    private sounds?: GameSounds;

    public constructor(audioContext: AudioContext) {
        this.audioContext = audioContext;
    }

    private async loadAudioBuffer(path: string) {
        const response = await fetch(path);
        const data = await response.arrayBuffer();
        return this.audioContext.decodeAudioData(data);
    }

    public async loadSounds() {
        if (!this.sounds) {
            const list = await Promise.all(
                pathKeys.map(async (key): Promise<GameSound> => {
                    const path = paths[key];
                    const buffer = await this.loadAudioBuffer(path);
                    return {
                        key,
                        buffer,
                        path,
                    };
                })
            );

            this.sounds = {} as GameSounds;
            for (const sound of list) {
                this.sounds[sound.key] = sound;
            }
        }

        return this.sounds;
    }

    protected [PostConstruct]() {
        const instance = ++this.instance;
        const { sounds } = this;
        if (sounds) {
            // Remove old sounds
            for (const key of Object.keys(sounds) as GameSoundKey[]) {
                if (!pathKeys.includes(key)) delete sounds[key];
            }

            pathKeys.map(async (key) => {
                try {
                    const path = paths[key];
                    const buffer = await this.loadAudioBuffer(path);
                    // Do not continue if loadAudioBuffer started before a HMR and finished after
                    if (instance !== this.instance) return;

                    const sound = sounds[key];
                    if (sound) {
                        // Existing sound
                        // Path changes when the file content changes, since parcel adds a hash to the path
                        if (sound.path !== path) {
                            sound.buffer = buffer;
                        }
                    } else {
                        // New sound
                        sounds[key] = {
                            key,
                            buffer,
                            path,
                        };
                    }
                } catch (e) {
                    console.error(`Failed updating sound "${key}"!`, e);
                }
            });
        }
    }
}
