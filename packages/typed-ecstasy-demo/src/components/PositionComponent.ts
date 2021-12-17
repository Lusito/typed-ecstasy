import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

// Check out CameraFocusComponent for a more detailed explanation of components, configs and factories

export class PositionComponent extends Component {
    public x = 0;
    public y = 0;
}

export type PositionConfig = {
    x?: number;
    y?: number;
};

componentFactories.add("Position", (obtain, blueprint) => {
    const comp = obtain(PositionComponent);
    comp.x = blueprint.get("x", 1);
    comp.y = blueprint.get("y", 2);
    return comp;
});
