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
