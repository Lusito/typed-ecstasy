import { Entity, Family, IteratingSystem } from "typed-ecstasy";
import { Service } from "typedi";

import "../components/PickupComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";

@Service()
export class RenderSystem extends IteratingSystem {
    public constructor() {
        super(Family.all(PositionComponent, SpriteComponent).get());
    }

    protected override processEntity(entity: Entity, _deltaTime: number): void {
        const position = entity.require(PositionComponent);
        const sprite = entity.require(SpriteComponent);
        console.log(position.x, position.y, sprite.image, sprite.layer);
    }
}
