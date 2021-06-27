# Using the Entity Factory

Now we can assembly our entities:

## src/entrypoint.ts
```typescript
import { Engine } from "typed-ecstasy";

import { setupEntityFactory } from "./entityFactory";

// This is a simplified example of how you would use an entity factory to assemble entities
const engine = new Engine();
const factory = setupEntityFactory();

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
```
