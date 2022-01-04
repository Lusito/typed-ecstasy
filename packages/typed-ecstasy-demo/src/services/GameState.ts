import { Engine, Entity, Family, PostConstruct, PreDestroy, retainable, service } from "typed-ecstasy";
import { SignalConnections } from "typed-signals";

import { BallComponent } from "../components/BallComponent";
import { CollidableComponent } from "../components/CollidableComponent";
import { ColorComponent } from "../components/ColorComponent";
import { TriggerComponent } from "../components/TriggerComponent";

const ballsFamily = Family.all(BallComponent).get();
const bricksFamily = Family.all(CollidableComponent, TriggerComponent, ColorComponent).get();

@service("game/GameState", { hot: module.hot })
export class GameState {
    private readonly engine: Engine;
    private readonly balls: readonly Entity[] = [];
    private readonly bricks: readonly Entity[] = [];
    private readonly connections = new SignalConnections();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    private readonly infoElement = document.getElementById("info")!;

    @retainable
    private gameOver = "";

    @retainable
    private score = 0;

    @retainable
    private remainingBalls = 3;

    public constructor(engine: Engine) {
        this.engine = engine;
        this.updateInfo();
        this.balls = engine.entities.forFamily(ballsFamily);
        this.bricks = engine.entities.forFamily(bricksFamily);
    }

    protected [PostConstruct]() {
        this.connections.add(
            this.engine.entities.onRemoveForFamily(bricksFamily).connect(() => {
                if (this.bricks.length === 0) {
                    this.gameOver = "You Won!";
                    this.updateInfo();
                }
            })
        );
        this.connections.add(
            this.engine.entities.onRemoveForFamily(ballsFamily).connect(() => {
                if (this.balls.length === 0 && this.remainingBalls === 0) {
                    this.gameOver = "You Lost!";
                    this.updateInfo();
                }
            })
        );
        this.updateInfo();
    }

    protected [PreDestroy]() {
        this.connections.disconnectAll();
    }

    public addScore(value: number) {
        this.score += value;
        this.updateInfo();
    }

    public removeBall() {
        if (this.remainingBalls) {
            this.remainingBalls--;
            this.updateInfo();
            return true;
        }
        return false;
    }

    public updateInfo() {
        if (this.gameOver) this.infoElement.textContent = `${this.gameOver} ${this.score} points`;
        else this.infoElement.textContent = this.gameOver || `${this.score} points | ${this.remainingBalls} balls`;
    }
}
