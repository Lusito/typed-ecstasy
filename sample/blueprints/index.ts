import type { SampleEntityConfig } from "../types";
import { stoneBlueprint } from "./stoneBlueprint";
import { voidBlueprint } from "./voidBlueprint";

// This is a map of entity names to entity blueprints
export const blueprints: Record<string, SampleEntityConfig> = {
    stone: stoneBlueprint,
    void: voidBlueprint,
};
