import { EntityConfig } from "../EntityConfig";

const brickBlueprint: EntityConfig = {
    Position: {},
    Size: {
        width: 36,
        height: 12,
    },
    Collidable: {
        restitution: 1.02,
    },
};

export const redBrickBlueprint: EntityConfig = {
    ...brickBlueprint,
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
};

export const orangeBrickBlueprint: EntityConfig = {
    ...brickBlueprint,
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
};

export const greenBrickBlueprint: EntityConfig = {
    ...brickBlueprint,
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
};

export const yellowBrickBlueprint: EntityConfig = {
    ...brickBlueprint,
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
};
