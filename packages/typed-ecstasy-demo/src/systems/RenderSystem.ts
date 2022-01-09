import { Engine, Entity, Family, InjectSymbol, IteratingSystem, retainable, service } from "typed-ecstasy";

import { PositionComponent } from "../components/PositionComponent";
import { ColorComponent } from "../components/ColorComponent";
import { SizeComponent } from "../components/SizeComponent";
import { InputComponent } from "../components/InputComponent";

export const CanvasRenderingContext2D = InjectSymbol<CanvasRenderingContext2D>("CanvasRenderingContext2D");

const family = Family.all(PositionComponent, ColorComponent, SizeComponent).get();

@service({ hot: module.hot })
export class RenderSystem extends IteratingSystem {
    private readonly context2D: CanvasRenderingContext2D;

    @retainable
    private accumulator = 0;

    public constructor(engine: Engine, context2D: CanvasRenderingContext2D) {
        super(engine, family);
        this.context2D = context2D;
    }

    public override update(deltaTime: number) {
        this.accumulator += deltaTime;
        this.context2D.clearRect(0, 0, 620, 710);
        super.update(deltaTime);
    }

    protected override processEntity(entity: Entity) {
        const position = entity.require(PositionComponent);
        const size = entity.require(SizeComponent);
        const color = entity.require(ColorComponent);
        this.context2D.strokeStyle = "";
        this.context2D.fillStyle = color.color;
        this.context2D.lineWidth = 0;
        this.context2D.fillRect(position.x, position.y, size.width, size.height);

        // Just to demonstrate how we can use hot-module replacement
        if (entity.has(InputComponent)) {
            // Try modifying the values here:
            const pulseColor = "rgba(255,0,255,0.5)";
            const pulseSpeed = 2;
            const borderMin = 1;
            const borderMax = 5;
            this.context2D.strokeStyle = pulseColor;
            const border = borderMin + (1 + Math.sin(this.accumulator * pulseSpeed)) * 0.5 * (borderMax - borderMin);
            this.context2D.lineWidth = border;
            this.context2D.strokeRect(
                position.x - 0.5 * border,
                position.y - 0.5 * border,
                size.width + border,
                size.height + border
            );
        }
    }
}
