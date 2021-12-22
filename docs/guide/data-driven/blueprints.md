# Defining Blueprints

FIXME: This might need to be updated:

Now that we know how we can configure an entity, we can define entity blueprints for our entities.
Depending on your use-case you could define them in TypeScript files (to have auto-completion and type-safety),
store them as json files or get them in some other form. For simplicity, let's write them in a TypeScript file here.

Let's create a folder `src/blueprints` and add these files to it:
- stoneBlueprint.ts
- .. additional files for more entities
- index.ts

## src/blueprints/stoneBlueprint.ts
```typescript
import type { SampleEntityConfig } from "../types";

// Here we define an entity blueprint, which contains 4 components and their default values
export const stoneBlueprint: SampleEntityConfig = {
    Position: {
        x: 10.1,
        y: 11.2,
    },
    Sprite: {
        image: "stone.png",
        layer: 3,
    },
    Pickup: {
        material: "stone",
        amount: 4,
    },
    CameraFocus: {
        weight: 42,
    },
};
```

Now we can create a map, where the entity name is the key (by which we will later create the entity) and the blueprint is the value:

## src/blueprints/index.ts
```typescript
import type { SampleEntityConfig } from "../types";
import { stoneBlueprint } from "./stoneBlueprint";

// This is a map of entity names to entity blueprints
export const blueprints: Record<string, SampleEntityConfig> = {
    stone: stoneBlueprint,
    // ... add more blueprints here
};
```
