import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

// Check out CameraFocusComponent for a more detailed explanation of components, configs and factories

export class SpriteComponent extends Component {
    public image = "";
    public layer = 0;
}

export type SpriteConfig = {
    image: string;
    layer?: number;
};

componentFactories.add("Sprite", (obtain, blueprint) => {
    const comp = obtain(SpriteComponent);
    comp.image = blueprint.get("image", "notfound.png");
    comp.layer = blueprint.get("layer", 1);
    return comp;
});
