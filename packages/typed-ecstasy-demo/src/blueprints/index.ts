import { EntityConfig } from "../EntityConfig";
import { stoneBlueprint } from "./stoneBlueprint";
import { voidBlueprint } from "./voidBlueprint";

// This is a map of entity names to entity blueprints
export const blueprints: Record<string, EntityConfig> = {
    stone: stoneBlueprint,
    void: voidBlueprint,
};
