import { Engine, Entity, Family, IteratingSystem, service } from "typed-ecstasy";

import { CollidableComponent } from "../components/CollidableComponent";
import { PositionComponent, PositionData } from "../components/PositionComponent";
import { SizeComponent, SizeData } from "../components/SizeComponent";
import { TriggerComponent } from "../components/TriggerComponent";
import { VelocityComponent, VelocityData } from "../components/VelocityComponent";
import { GameState } from "../services/GameState";

// Adjusted from: https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/swept-aabb-collision-detection-and-response-r3084/
function sweptAABB(
    vel: VelocityData,
    deltaTime: number,
    p1: PositionData,
    s1: SizeData,
    p2: PositionData,
    s2: SizeData,
    normal: { x: number; y: number }
) {
    const dx = vel.x * deltaTime;
    const dy = vel.y * deltaTime;
    let xInvEntry;
    let yInvEntry;
    let xInvExit;
    let yInvExit;

    // find the distance between the objects on the near and far sides for both x and y
    if (dx > 0) {
        xInvEntry = p2.x - (p1.x + s1.width);
        xInvExit = p2.x + s2.width - p1.x;
    } else {
        xInvEntry = p2.x + s2.width - p1.x;
        xInvExit = p2.x - (p1.x + s1.width);
    }

    if (dy > 0) {
        yInvEntry = p2.y - (p1.y + s1.height);
        yInvExit = p2.y + s2.height - p1.y;
    } else {
        yInvEntry = p2.y + s2.height - p1.y;
        yInvExit = p2.y - (p1.y + s1.height);
    }

    // find time of collision and time of leaving for each axis (if statement is to prevent divide by zero)
    let xEntry;
    let yEntry;
    let xExit;
    let yExit;

    if (dx === 0) {
        xEntry = -Infinity;
        xExit = Infinity;
    } else {
        xEntry = xInvEntry / dx;
        xExit = xInvExit / dx;
    }

    if (dy === 0) {
        yEntry = -Infinity;
        yExit = Infinity;
    } else {
        yEntry = yInvEntry / dy;
        yExit = yInvExit / dy;
    }

    // find the earliest/latest times of collision
    const entryTime = Math.max(xEntry, yEntry);
    const exitTime = Math.min(xExit, yExit);

    // if there was no collision
    if (entryTime > exitTime || (xEntry < 0 && yEntry < 0) || xEntry > 1 || yEntry > 1) {
        normal.x = 0;
        normal.y = 0;
        return 1;
    }

    // if there was a collision
    // calculate normal of collided surface
    if (xEntry > yEntry) {
        if (xInvEntry < 0) {
            normal.x = 1;
            normal.y = 0;
        } else {
            normal.x = -1;
            normal.y = 0;
        }
    } else if (yInvEntry < 0) {
        normal.x = 0;
        normal.y = 1;
    } else {
        normal.x = 0;
        normal.y = -1;
    }

    // return the time of collision
    return entryTime;
}

const family = Family.all(PositionComponent, SizeComponent, VelocityComponent).get();
const tempNormalA = { x: 0, y: 0 };
const tempNormalB = { x: 0, y: 0 };

@service("game/MovementSystem", { hot: module.hot })
export class MovementSystem extends IteratingSystem {
    private readonly gameState: GameState;
    private readonly collidables: readonly Entity[];

    public constructor(engine: Engine, gameState: GameState) {
        super(engine, family);

        this.gameState = gameState;
        this.collidables = engine.entities.forFamily(
            Family.all(CollidableComponent, SizeComponent, PositionComponent).get()
        );
    }

    protected override processEntity(entity: Entity, deltaTime: number) {
        const position = entity.require(PositionComponent);
        const size = entity.require(SizeComponent);
        const vel = entity.require(VelocityComponent);

        // must run until time is done
        for (let i = 0; i < 10 && deltaTime > 0 && !entity.isScheduledForRemoval(); i++) {
            let normal = tempNormalA;
            let nextNormal = tempNormalB;
            let bestTime = 1;
            let bestCollidable: Entity | null = null;
            for (const collidable of this.collidables) {
                if (collidable.isScheduledForRemoval()) continue;

                const p = collidable.require(PositionComponent);
                const s = collidable.require(SizeComponent);
                const time = sweptAABB(vel, deltaTime, position, size, p, s, nextNormal);
                if (time < bestTime) {
                    // collision happened
                    bestTime = time;
                    bestCollidable = collidable;
                    // swap normals
                    const temp = normal;
                    normal = nextNormal;
                    nextNormal = temp;
                }
            }

            if (!bestCollidable) {
                // no more collisions, apply the final step
                position.x += deltaTime * vel.x;
                position.y += deltaTime * vel.y;
                break;
            }

            this.runCollisionTriggers(entity, bestCollidable);
            const c = bestCollidable.require(CollidableComponent);
            const usedTime = deltaTime * bestTime;
            // Adjust new position
            position.x += usedTime * vel.x;
            position.y += usedTime * vel.y;
            // Adjust velocity
            if (Math.abs(normal.x) > 0.0001) vel.x *= -c.restitution;
            if (Math.abs(normal.y) > 0.0001) {
                if (c.impactControlX === 0) {
                    vel.y *= -c.restitution;
                } else {
                    const p = bestCollidable.require(PositionComponent);
                    const s = bestCollidable.require(SizeComponent);
                    const x = position.x + size.width * 0.5;
                    const cx = p.x + s.width * 0.5;
                    const factor = Math.min(1, (x - cx) / (s.width * 0.5));
                    const degrees = 90 - c.impactControlX * factor;
                    const radians = degrees * (Math.PI / 180);
                    const len = Math.sqrt(vel.x ** 2 + vel.y ** 2);
                    vel.x = len * Math.cos(radians);
                    vel.y = len * (vel.y > 0 ? -Math.sin(radians) : Math.sin(radians));
                }
            }
            deltaTime -= usedTime;
        }
    }

    private runCollisionTriggers(entity: Entity, collidable: Entity) {
        const trigger = collidable.get(TriggerComponent);
        if (trigger) {
            for (const action of trigger.actions) {
                switch (action.type) {
                    case "score":
                        this.gameState.addScore(action.value);
                        break;
                    case "removeOther":
                        entity.destroy();
                        break;
                    case "removeSelf":
                        collidable.destroy();
                        break;
                }
            }
        }
    }
}
