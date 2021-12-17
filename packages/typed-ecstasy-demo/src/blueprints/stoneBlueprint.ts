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
