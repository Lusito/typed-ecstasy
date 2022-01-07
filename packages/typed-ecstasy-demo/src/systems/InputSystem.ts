import { Engine, Entity, EntityFactory, Family, IteratingSystem, service } from "typed-ecstasy";

import { BallComponent } from "../components/BallComponent";
import { InputComponent } from "../components/InputComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SizeComponent } from "../components/SizeComponent";
import { wallSize } from "../levels/default";
import { GameState } from "../services/GameState";

const family = Family.all(InputComponent, PositionComponent, SizeComponent).get();

@service({ hot: module.hot })
export class InputSystem extends IteratingSystem {
    private readonly gameState: GameState;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    private readonly canvas = document.getElementById("canvas")!;
    private mouseX = 0;
    private balls: Entity[] = [];
    private launchBall = false;

    public constructor(engine: Engine, gameState: GameState) {
        super(engine, family);
        this.gameState = gameState;
    }

    protected override onEnable() {
        super.onEnable();
        this.balls = this.engine.entities.forFamily(Family.all(BallComponent).get());
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("click", this.onClick);
    }

    protected override onDisable() {
        super.onDisable();
        this.balls = [];
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("click", this.onClick);
    }

    private onMouseMove = (e: MouseEvent) => {
        this.mouseX = e.clientX - this.canvas.offsetLeft - this.canvas.clientLeft;
    };

    private onClick = (e: MouseEvent) => {
        if (e.button === 0 && this.balls.length === 0) {
            this.launchBall = true;
        }
    };

    protected override processEntity(entity: Entity) {
        const position = entity.require(PositionComponent);
        const size = entity.require(SizeComponent);
        position.x = Math.max(
            wallSize,
            Math.min(this.canvas.clientWidth - wallSize - size.width, this.mouseX - size.width / 2)
        );

        if (this.launchBall) {
            if (this.gameState.removeBall()) {
                const factory: EntityFactory<EntityConfig> = this.engine.container.get(EntityFactory);
                this.engine.entities.add(
                    factory.assemble("ball", {
                        Position: {
                            x: position.x + size.width / 2,
                            y: position.y - size.height / 2,
                        },
                        Velocity: {
                            y: -220,
                            x: 120,
                        },
                    })
                );
            }
            this.launchBall = false;
        }
    }
}
