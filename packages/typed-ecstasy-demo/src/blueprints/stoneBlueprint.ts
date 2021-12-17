import { EntityConfig } from "../EntityConfig";

// Here we define an entity blueprint, which contains 4 components and their default values
export const stoneBlueprint: EntityConfig = {
    Position: {
        x: 10.1,
        y: 11.2,
    },
    Velocity: {
        x: 100,
        y: 150,
    },
    Sprite: {
        image: "rgb(0, 0, 200)",
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
