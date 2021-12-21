import "@abraham/reflection";
import { Allocator, Engine } from "typed-ecstasy";

import { setupEntityFactory } from "./entityFactory";
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

// Create an entity in a simple fashion:
const simple = factory.assemble("stone");
// Then add it to the engine:
engine.entities.add(simple);

// Or override settings by component:
const modified = factory.assemble("stone", {
    Position: {
        x: 40,
        y: 300,
    },
    Sprite: {
        image: "rgb(0, 200, 0)",
    },
});
// Don't forget to add it to the engine:
engine.entities.add(modified);
engine.systems.add(MovementSystem);
engine.systems.add(RenderSystem);

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
