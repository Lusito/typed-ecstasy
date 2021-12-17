import { Entity, Family, IteratingSystem } from "typed-ecstasy";
import { Service } from "typedi";

import { PositionComponent } from "../components/PositionComponent";

@Service()
export class MovementSystem extends IteratingSystem {
    public constructor() {
        super(Family.all(PositionComponent).get());
    }

    protected override processEntity(entity: Entity, deltaTime: number): void {
        const position = entity.require(PositionComponent);
        position.x += deltaTime * 10;
        position.y += deltaTime * 10;
    }
}
