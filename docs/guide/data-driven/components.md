# Code for the Components

FIXME: This needs to be updated:

Let's create a folder `src/components` and add 5 files to it:
- componentFactories.ts
- PositionComponent.ts
- SpriteComponent.ts
- PickupComponent.ts
- CameraFocusComponent.ts

## src/components/componentFactories.ts

```typescript
import { createComponentFactoryRegistry } from "typed-ecstasy";

import type { SampleContext, SampleEntityConfig } from "../types";

// We define a component factory registry here, which knows the types we want to use
export const componentFactories = createComponentFactoryRegistry<SampleEntityConfig, SampleContext>();
```

Ignore the types `SampleEntityConfig` and `SampleContext` for now, we'll get to them later.

## src/components/CameraFocusComponent.ts

```typescript
import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

// First of all, we need the component itself. This is what you will interact with in your entity systems.
export class CameraFocusComponent extends Component {
    public weight = 1;

    // Optional: You can implement a reset method, which will be called if pooling is in place.
    // It will be called when the component gets removed and the pool didn't reach its maximum size yet.
    // But: This is rarely necessary, since you will mostly reset the values in the factory below.
    // It might be a valid use-case if the component keeps references that might prevent garbage collection.
    // public reset() {
    //     this.weight = 1;
    // }
}

// Then we need a configuration type, i.e. the data that is needed to assemble your entity correctly
// To be able to configure the above component using a data-driven approach,
// we need to first define, what properties can be configured using that data.
// The following interface represent your json data:
export type CameraFocusConfig = {
    weight?: number;
};

// Finally, we need to register a factory, which reads values from the blueprint and assigns it to the new component.
componentFactories.add(
    // The first parameter must be a key from SampleEntityConfig.
    "CameraFocus",
    // The second parameter is a factory function to assemble the component.
    (obtain, blueprint, context) => {
        // Use obtain() to create a component rather than creating one using `new`. This allows us to use object pooling.
        const comp = obtain(CameraFocusComponent);
        // Use blueprint.get to receive configuration properties
        // It will automatically know the property names and types as specified in the config type above.
        comp.weight = blueprint.get(
            // blueprint.get() has autocompletion for the properties you defined in the config type above!
            "weight",
            // The second parameter is a fallback value, which gets used when the blueprint does not have a value for the specified key.
            // Its type is matched against the type in your config type above.
            // Check out ../types.ts to find out what a context is!
            context.defaultCameraFocusWeight
        );

        // A component factory must return a fully initialized component or null if you want to skip adding this component for some reason.
        return comp;
    }
);
```

## src/components/PositionComponent.ts

```typescript
import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

export class PositionComponent extends Component {
    public x = 0;
    public y = 0;
}

export type PositionConfig = {
    x?: number;
    y?: number;
};

componentFactories.add("Position", (obtain, blueprint) => {
    const comp = obtain(PositionComponent);
    comp.x = blueprint.get("x", 1);
    comp.y = blueprint.get("y", 2);
    return comp;
});
```

## src/components/SpriteComponent.ts

```typescript
import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

export class SpriteComponent extends Component {
    public image = "";
    public layer = 0;
}

export type SpriteConfig = {
    image: string;
    layer?: number;
};

componentFactories.add("Sprite", (obtain, blueprint) => {
    const comp = obtain(SpriteComponent);
    comp.image = blueprint.get("image", "notfound.png");
    comp.layer = blueprint.get("layer", 1);
    return comp;
});
```

## src/components/PickupComponent.ts

```typescript
import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

export class PickupComponent extends Component {
    public material: "stone" | "wood" = "wood";
    public amount = 1;
}

export type PickupConfig = {
    material: "stone" | "wood";
    amount: number;
};

componentFactories.add("Pickup", (obtain, blueprint) => {
    const comp = obtain(PickupComponent);
    comp.material = blueprint.get("material", "wood");
    comp.amount = blueprint.get("amount", 1);
    return comp;
});
```
