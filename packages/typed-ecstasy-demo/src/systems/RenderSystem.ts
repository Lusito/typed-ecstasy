import { Engine, Entity, Family, IteratingSystem, retainable, service } from "typed-ecstasy";

import { PositionComponent } from "../components/PositionComponent";
import { ColorComponent } from "../components/ColorComponent";
import { GameContext2D } from "../types";
import { SizeComponent } from "../components/SizeComponent";

const family = Family.all(PositionComponent, ColorComponent, SizeComponent).get();

// fixme: use sorted iterating system
@service("game/RenderSystem", { hot: module.hot })
export class RenderSystem extends IteratingSystem {
    private readonly context2D: GameContext2D;

    // fixme: find better example for retainable property
    @retainable
    private size = 3;

    public constructor(engine: Engine, context2D: GameContext2D) {
        super(engine, family);
        this.context2D = context2D;
    }

    public override update(deltaTime: number) {
        this.size += deltaTime;
        this.context2D.clearRect(0, 0, 620, 710);
        super.update(deltaTime);
    }

    protected override processEntity(entity: Entity) {
        const position = entity.require(PositionComponent);
        const size = entity.require(SizeComponent);
        const color = entity.require(ColorComponent);
        this.context2D.fillStyle = color.color;
        this.context2D.fillRect(position.x, position.y, size.width, size.height);
    }
}
