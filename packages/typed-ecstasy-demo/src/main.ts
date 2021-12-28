import "@abraham/reflection";
import { Allocator, Engine } from "typed-ecstasy";

import { setupEntityFactory } from "./entityFactory";
import { defaultLevel } from "./levels/default";
import { InputSystem } from "./systems/InputSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { RenderSystem } from "./systems/RenderSystem";
import { GameConfig, GameContext2D } from "./types";

// This is a simplified example of how you would use an entity factory to assemble entities

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context2D = canvas.getContext("2d");

// Use PoolAllocator instead to use object pooling
const allocator = new Allocator();
// eslint-disable-next-line @typescript-eslint/no-shadow
const engine = new Engine(allocator);
engine.container.set(GameContext2D, context2D);
// A simple config dependency, which can be used by component factories and services
engine.container.set(GameConfig, { defaultCameraFocusWeight: 1 });

const factory = setupEntityFactory(engine);

for (const [type, x, y, width, height] of defaultLevel) {
    engine.entities.add(factory.assemble(type, {
        Position: {
            x,
            y,
        },
        Size: {
            width,
            height
        }
    }));
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
