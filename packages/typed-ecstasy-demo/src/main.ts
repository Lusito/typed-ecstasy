import "@abraham/reflection";
import { Allocator, Engine } from "typed-ecstasy";
import { createAudioContext } from "sounts";
/* eslint-disable import/no-unresolved, import/extensions */
import yellowExplosionUrl from "url:./sounds/explosion_yellow.wav";
import greenExplosionUrl from "url:./sounds/explosion_green.wav";
import orangeExplosionUrl from "url:./sounds/explosion_orange.wav";
import redExplosionUrl from "url:./sounds/explosion_red.wav";
import hitPaddleUrl from "url:./sounds/hit_paddle.wav";
import hitWallUrl from "url:./sounds/hit_wall.wav";
/* eslint-enable import/no-unresolved, import/extensions */

import { setupEntityFactory } from "./entityFactory";
import { defaultLevel } from "./levels/default";
import { InputSystem } from "./systems/InputSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { GameAudioContext, GameContext2D } from "./types";
import { loadAudioBuffer } from "./utils";
import { SoundService } from "./services/SoundService";

// This is a simplified example of how you would use an entity factory to assemble entities

const audioContext = createAudioContext();
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context2D = canvas.getContext("2d");

async function createGameAudioContext(): Promise<GameAudioContext> {
    const hitPaddle = await loadAudioBuffer(audioContext, hitPaddleUrl);
    const hitWall = await loadAudioBuffer(audioContext, hitWallUrl);
    const yellowExplosion = await loadAudioBuffer(audioContext, yellowExplosionUrl);
    const greenExplosion = await loadAudioBuffer(audioContext, greenExplosionUrl);
    const orangeExplosion = await loadAudioBuffer(audioContext, orangeExplosionUrl);
    const redExplosion = await loadAudioBuffer(audioContext, redExplosionUrl);

    return {
        audioContext,
        sounds: {
            hitPaddle,
            hitWall,
            yellowExplosion,
            greenExplosion,
            orangeExplosion,
            redExplosion,
        },
    };
}

async function init() {
    // Load some sounds
    const audioBuffers = await createGameAudioContext();

    // Use PoolAllocator instead to use object pooling
    const allocator = new Allocator();
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const engine = new Engine(allocator);
    // some manual dependencies, which can be used by component factories and services
    engine.container.set(GameContext2D, context2D);
    engine.container.set(GameAudioContext, audioBuffers);
    // By getting the SoundService, we also create an instance of it.
    engine.container.get(SoundService);

    const factory = setupEntityFactory(engine);

    for (const [type, x, y, width, height] of defaultLevel) {
        engine.entities.add(
            factory.assemble(type, {
                Position: {
                    x,
                    y,
                },
                Size: {
                    width,
                    height,
                },
            })
        );
    }

    engine.systems.add(MovementSystem);
    engine.systems.add(RenderSystem);
    engine.systems.add(InputSystem);

    let lastTime = 0;
    let hasError = false;
    function render(time: number) {
        const delta = (time - lastTime) / 1000;
        lastTime = time;

        try {
            engine.update(delta);
            hasError = false;
        } catch (e) {
            if (!hasError) {
                hasError = true;
                console.error("Error updating engine", e);
            }
        }
        window.requestAnimationFrame(render);
    }

    window.requestAnimationFrame(render);
}

init();
