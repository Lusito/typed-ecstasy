import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

// Check out CameraFocusComponent for a more detailed explanation of components, configs and factories

export class PickupComponent extends Component {
    public material: "stone" | "wood" = "wood";
    public amount = 1;
}

export type PickupConfig = {
    material: "stone" | "wood";
    amount: number;
};

componentFactories.add("Pickup", (obtain, blueprint) => {
    const comp = obtain(PickupComponent);
    comp.material = blueprint.get("material", "wood");
    comp.amount = blueprint.get("amount", 1);
    return comp;
});
