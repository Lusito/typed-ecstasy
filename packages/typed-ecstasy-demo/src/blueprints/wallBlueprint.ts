import { createEntityBlueprint } from "typed-ecstasy";

export const wall = createEntityBlueprint<EntityConfig>({
    Position: {},
    Size: {},
    Collidable: {},
    Color: {
        color: "white",
    },
    Sound: {
        hit: "hitWall",
    },
});
