import { EntityConfig } from "../EntityConfig";

export const ballBlueprint: EntityConfig = {
    Position: {},
    Size: {
        width: 12,
        height: 8,
    },
    Velocity: {},
    Color: {
        color: "white",
        layer: 10,
    },
    Ball: true,
    Sound: {
        create: "hitPaddle",
    },
};
