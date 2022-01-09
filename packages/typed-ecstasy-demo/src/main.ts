import "@abraham/reflection";
import { PoolAllocator, Container, Engine, EntityFactory } from "typed-ecstasy";
import { createAudioContext } from "sounts";

import { defaultLevel } from "./levels/default";
import { InputSystem } from "./systems/InputSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { RenderSystem, CanvasRenderingContext2D } from "./systems/RenderSystem";
import { SoundService } from "./services/SoundService";
import { AssetService, GameSounds } from "./services/AssetService";
import { BlueprintService } from "./services/BlueprintService";

// This is a simplified example of how you would use an entity factory to assemble entities

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
    // By getting the SoundService, we also create an instance of it (if it didn't exist already).
    container.get(SoundService);
    container.get(BlueprintService);

    // fixme: How to handle level changes? reload?
    const factory: EntityFactory<EntityConfig> = container.get(EntityFactory);

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

    // fixme: create service for engine code?
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

// Anything that isn't explicitly handled needs a forced reload.
// Otherwise the game might be created twice
if (module.hot) {
    // fixme: reuse old game instead of reloading
    module.hot.dispose(() => {
        window.location.reload();
    });
}
