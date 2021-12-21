import { Engine, Entity, Family, IteratingSystem, service } from "typed-ecstasy";

import { PositionComponent } from "../components/PositionComponent";
import { VelocityComponent } from "../components/VelocityComponent";

const family = Family.all(PositionComponent, VelocityComponent).get();

@service("game/movement-system", { hot: module.hot })
export class MovementSystem extends IteratingSystem {
    public constructor(engine: Engine) {
        super(engine, family);
    }

    protected override processEntity(entity: Entity, deltaTime: number) {
        const position = entity.require(PositionComponent);
        const vel = entity.require(VelocityComponent);
        position.x += deltaTime * vel.x;
        position.y += deltaTime * vel.y;
        if (position.x > 394) {
            position.x = 394 - (position.x - 394);
            vel.x *= -1;
        } else if (position.x < 0) {
            position.x *= -1;
            vel.x *= -1;
        }
        if (position.y > 394) {
            position.y = 394 - (position.y - 394);
            vel.y *= -1;
        } else if (position.y < 0) {
            position.y *= -1;
            vel.y *= -1;
        }
    }
}
