import { Engine, Entity, Family, IteratingSystem, retainable, service } from "typed-ecstasy";

import { PositionComponent } from "../components/PositionComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { GameContext2D } from "../types";

const family = Family.all(PositionComponent, SpriteComponent).get();

@service("game/rendering-system", { hot: module.hot })
export class RenderSystem extends IteratingSystem {
    private readonly context2D: GameContext2D;

    @retainable
    private size = 3;

    public constructor(engine: Engine, context2D: GameContext2D) {
        super(engine, family);
        this.context2D = context2D;
    }

    public override update(deltaTime: number) {
        this.size += deltaTime;
        this.context2D.clearRect(0, 0, 400, 400);
        super.update(deltaTime);
    }

    protected override processEntity(entity: Entity) {
        const position = entity.require(PositionComponent);
        const sprite = entity.require(SpriteComponent);
        this.context2D.fillStyle = sprite.image;
        this.context2D.fillRect(position.x - this.size / 2, position.y - this.size / 2, this.size, this.size);
    }
}
