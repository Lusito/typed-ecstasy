import "@abraham/reflection";
import { PoolAllocator, Container, Engine } from "typed-ecstasy";
import { createAudioContext } from "sounts";

import { defaultLevel } from "./levels/default";
import { CanvasRenderingContext2D } from "./systems/RenderSystem";
import { SoundService } from "./services/SoundService";
import { AssetService, GameSounds } from "./services/AssetService";
import { EntityFactory } from "./services/EntityFactory";
import { SystemsService } from "./services/SystemsService";

// Any changes that affect this file will cause a reload.
// Otherwise the game might be created twice
if (module.hot) {
    // fixme: reuse old game instead of reloading
    module.hot.dispose(() => {
        window.location.reload();
    });
}

// Anything that only affects services and systems can make use of Hot Module Replacement.
// So try to keep this entry file as small as possible.

const audioContext = createAudioContext();
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context2D = canvas.getContext("2d");

async function init() {
    const container = new Container();
    container.set(AudioContext, audioContext);
    // Load some sounds
    const gameSounds = await container.get(AssetService).loadSounds();

    const engine = new Engine({
        allocator: new PoolAllocator(),
        container,
    });

    // some manual dependencies, which can be used by component factories and services
    container.set(CanvasRenderingContext2D, context2D);
    container.set(GameSounds, gameSounds);
    // By getting these services, we also create an instance of them (if they didn't exist already).
    container.get(SoundService);
    container.get(EntityFactory);
    container.get(SystemsService);

    loadLevel(engine);
    startRendering(engine);
}

function loadLevel(engine: Engine) {
    const factory = engine.container.get(EntityFactory);

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
}

function startRendering(engine: Engine) {
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
