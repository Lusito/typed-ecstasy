import { createEntityBlueprint } from "typed-ecstasy";

export const deadZone = createEntityBlueprint<EntityConfig>({
    Position: {},
    Size: {},
    Collidable: {},
    Trigger: {
        actions: [
            {
                type: "removeOther",
            },
        ],
    },
});
