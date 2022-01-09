import * as blueprints from "../blueprints";

export type EntityName = keyof typeof blueprints;

export type LevelEntity = [type: EntityName, x: number, y: number, width?: number, height?: number];

const brickWidth = 36;
const brickHeight = 12;
const padding = 8;
const stepX = brickWidth + padding;
const stepY = brickHeight + padding;
export const wallSize = 6;
function createRow(brickType: EntityName, y: number) {
    const row: LevelEntity[] = [];
    let x = wallSize;
    for (let i = 0; i < 14; i++) {
        row.push([brickType, x, y]);
        x += stepX;
    }
    return row;
}

let y = 80;
export const defaultLevel: LevelEntity[] = [
    ...createRow("redBrick", y),
    ...createRow("redBrick", (y += stepY)),
    ...createRow("orangeBrick", (y += stepY)),
    ...createRow("orangeBrick", (y += stepY)),
    ...createRow("greenBrick", (y += stepY)),
    ...createRow("greenBrick", (y += stepY)),
    ...createRow("yellowBrick", (y += stepY)),
    ...createRow("yellowBrick", (y += stepY)),
    ["paddle", 283, 620],
    ["wall", 0, 0, wallSize, 710],
    ["wall", 620 - wallSize, 0, wallSize, 710],
    ["wall", wallSize, 0, 620 - 2 * wallSize, wallSize],
    ["wall", wallSize, 710 - wallSize, 620 - 2 * wallSize, wallSize],
    ["deadZone", wallSize, 710 - wallSize * 2, 620 - 2 * wallSize, wallSize],
];
