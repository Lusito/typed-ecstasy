import { PostConstruct, retainable, service } from "typed-ecstasy";
/* eslint-disable import/no-unresolved, import/extensions */
import yellowExplosionUrl from "url:../sounds/explosion_yellow.wav";
import greenExplosionUrl from "url:../sounds/explosion_green.wav";
import orangeExplosionUrl from "url:../sounds/explosion_orange.wav";
import redExplosionUrl from "url:../sounds/explosion_red.wav";
import hitPaddleUrl from "url:../sounds/hit_paddle.wav";
import hitWallUrl from "url:../sounds/hit_wall.wav";
/* eslint-enable import/no-unresolved, import/extensions */

import type { GameSound, GameSoundKey, GameSounds } from "../types";

type GameSoundPaths = { [P in GameSoundKey]: string };

const paths: GameSoundPaths = {
    hitPaddle: hitPaddleUrl,
    hitWall: hitWallUrl,
    yellowExplosion: yellowExplosionUrl,
    greenExplosion: greenExplosionUrl,
    orangeExplosion: orangeExplosionUrl,
    redExplosion: redExplosionUrl,
};

/**
 * By using the import "url:..."" feature from parcel, we can actually use HMR for binary file updates as well!
 *
 * This Service makes use of this by reloading sounds when the path changed.
 */
@service({ hot: module.hot })
export class AssetService {
    private readonly audioContext: AudioContext;
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
                (Object.keys(paths) as GameSoundKey[]).map(async (key): Promise<GameSound> => {
                    const path = paths[key];
                    const buffer = await this.loadAudioBuffer(hitPaddleUrl);
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
        const { sounds } = this;
        if (sounds) {
            (Object.keys(paths) as GameSoundKey[]).map(async (key) => {
                const sound = sounds[key];
                const path = paths[key];
                // Path changes when the file content changes, since parcel adds a hash to the path
                if (sound.path !== path) {
                    sound.buffer = await this.loadAudioBuffer(hitPaddleUrl);
                }
            });
        }
    }
}
