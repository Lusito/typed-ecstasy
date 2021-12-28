import { EntityConfig } from "../EntityConfig";
import { ballBlueprint } from "./ballBlueprint";
import { greenBrickBlueprint, orangeBrickBlueprint, redBrickBlueprint, yellowBrickBlueprint } from "./brickBlueprints";
import { paddleBlueprint } from "./paddleBlueprint";
import { voidBlueprint } from "./voidBlueprint";
import { wallBlueprint } from "./wallBlueprint";

// This is a map of entity names to entity blueprints
export const blueprints: Record<string, EntityConfig> = {
    // Bricks
    redBrick: redBrickBlueprint,
    orangeBrick: orangeBrickBlueprint,
    greenBrick: greenBrickBlueprint,
    yellowBrick: yellowBrickBlueprint,
    // Level
    wall: wallBlueprint,
    void: voidBlueprint,
    // Player/Paddel
    paddle: paddleBlueprint,
    // Ball
    ball: ballBlueprint,
};

export type EntityName =
    | "redBrick"
    | "orangeBrick"
    | "greenBrick"
    | "yellowBrick"
    | "wall"
    | "void"
    | "paddle"
    | "ball";
