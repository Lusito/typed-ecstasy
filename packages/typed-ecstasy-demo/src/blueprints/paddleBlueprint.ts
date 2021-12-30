import { EntityConfig } from "../EntityConfig";

export const paddleBlueprint: EntityConfig = {
    Position: {},
    Size: {
        width: 42,
        height: 12,
    },
    Collidable: {
        restitution: 1,
        impactControlX: 55,
    },
    Color: {
        color: "#0A85C2",
    },
    Input: true,
    Sound: {
        hitSound: "hitPaddle",
    },
};
