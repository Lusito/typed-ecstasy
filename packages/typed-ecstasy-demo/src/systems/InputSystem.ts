import { Engine, Entity, EntitySystem, Family, service } from "typed-ecstasy";

import { BallComponent } from "../components/BallComponent";
import { InputComponent } from "../components/InputComponent";
import { PositionComponent } from "../components/PositionComponent";
import { SizeComponent } from "../components/SizeComponent";
import { wallSize } from "../levels/default";
import { EntityFactory } from "../services/EntityFactory";
import { GameState } from "../services/GameState";

@service({ hot: module.hot })
export class InputSystem extends EntitySystem {
    private readonly gameState: GameState;
    private readonly factory: EntityFactory;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    private readonly canvas = document.getElementById("canvas")!;
    /** The list of entities processed by the system. */
    private readonly paddles: readonly Entity[];
    private readonly balls: Entity[] = [];

    public constructor(engine: Engine, gameState: GameState, factory: EntityFactory) {
        super(engine);
        this.gameState = gameState;
        this.factory = factory;
        this.paddles = this.engine.entities.forFamily(
            Family.all(InputComponent, PositionComponent, SizeComponent).get()
        );
        this.balls = this.engine.entities.forFamily(Family.all(BallComponent).get());
    }

    protected override onEnable() {
        window.addEventListener("mousemove", this.onMouseMove);
        window.addEventListener("click", this.onClick);
    }

    protected override onDisable() {
        window.removeEventListener("mousemove", this.onMouseMove);
        window.removeEventListener("click", this.onClick);
    }

    private onMouseMove = (e: MouseEvent) => {
        const paddle = this.paddles[0];
        if (paddle) {
            const mouseX = e.clientX - this.canvas.offsetLeft - this.canvas.clientLeft;

            const position = paddle.require(PositionComponent);
            const size = paddle.require(SizeComponent);
            position.x = Math.max(
                wallSize,
                Math.min(this.canvas.clientWidth - wallSize - size.width, mouseX - size.width / 2)
            );
        }
    };

    private onClick = (e: MouseEvent) => {
        const paddle = this.paddles[0];
        if (paddle && e.button === 0 && this.balls.length === 0 && this.gameState.removeBall()) {
            const position = paddle.require(PositionComponent);
            const size = paddle.require(SizeComponent);
            this.engine.entities.add(
                this.factory.assemble("ball", {
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
    };
}
