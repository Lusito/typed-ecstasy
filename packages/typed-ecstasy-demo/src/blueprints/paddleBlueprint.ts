import { EntityConfig } from "typed-ecstasy";

export const paddle: EntityConfig = {
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
        hit: "hitPaddle",
    },
};
