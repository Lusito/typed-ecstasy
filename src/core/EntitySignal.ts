import { Signal } from "typed-signals";

import type { Entity } from "./Entity";

/**
 *  A simple entity signal.
 */
export class EntitySignal extends Signal<(entity: Entity) => void> {}
