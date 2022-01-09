import { EntityConfig } from "typed-ecstasy";

export const deadZone: EntityConfig = {
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
};
