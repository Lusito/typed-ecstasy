import { createEntityBlueprint } from "typed-ecstasy";

const baseConfig: EntityConfig = {
    Position: {},
    Size: {
        width: 36,
        height: 12,
    },
    Collidable: {
        restitution: 1.02,
    },
};

export const redBrick = createEntityBlueprint<EntityConfig>({
    ...baseConfig,
    Color: {
        color: "#A51E0A",
    },
    Trigger: {
        actions: [
            {
                type: "score",
                value: 7,
            },
            {
                type: "removeSelf",
            },
        ],
    },
    Sound: {
        remove: "redExplosion",
    },
});

export const orangeBrick = createEntityBlueprint<EntityConfig>({
    ...baseConfig,
    Color: {
        color: "#C8890A",
    },
    Trigger: {
        actions: [
            {
                type: "score",
                value: 5,
            },
            {
                type: "removeSelf",
            },
        ],
    },
    Sound: {
        remove: "orangeExplosion",
    },
});

export const greenBrick = createEntityBlueprint<EntityConfig>({
    ...baseConfig,
    Color: {
        color: "#0A8633",
    },
    Trigger: {
        actions: [
            {
                type: "score",
                value: 3,
            },
            {
                type: "removeSelf",
            },
        ],
    },
    Sound: {
        remove: "greenExplosion",
    },
});

export const yellowBrick = createEntityBlueprint<EntityConfig>({
    ...baseConfig,
    Color: {
        color: "#C7C72A",
    },
    Trigger: {
        actions: [
            {
                type: "score",
                value: 1,
            },
            {
                type: "removeSelf",
            },
        ],
    },
    Sound: {
        remove: "yellowExplosion",
    },
});
