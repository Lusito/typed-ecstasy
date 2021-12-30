import { EntityConfig } from "../EntityConfig";

export const voidBlueprint: EntityConfig = {
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
