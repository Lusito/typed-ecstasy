import "@abraham/reflection";
import { Engine } from "typed-ecstasy";

import { setupEntityFactory } from "./entityFactory";
import { MovementSystem } from "./systems/MovementSystem";
import { RenderSystem } from "./systems/RenderSystem";

// Importing these manually, since they will otherwise be lost due to tree-shaking
import "./components/CameraFocusComponent";

// This is a simplified example of how you would use an entity factory to assemble entities
const engine = new Engine();
const factory = setupEntityFactory();

// Add some systems
engine.systems.add(RenderSystem);
engine.systems.add(MovementSystem);

// Create an entity in a simple fashion:
const simple = factory.assemble("stone");
// Then add it to the engine:
engine.entities.add(simple);

// Or override settings by component:
const modified = factory.assemble("stone", {
    Position: {
        x: 1337,
        y: 1337,
    },
});
// Don't forget to add it to the engine:
engine.entities.add(modified);

// Run updates
const deltaTime = 1234;
engine.update(deltaTime);
console.log("done");
