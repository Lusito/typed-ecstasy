/*******************************************************************************
* Copyright 2015 See AUTHORS file.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
******************************************************************************/

import { EntitySystem } from "../core/EntitySystem";
import { Family } from "../core/Family";
import { Entity } from "../core/Entity";
import { Engine } from "../core/Engine";

/**
 * A simple EntitySystem that iterates over each entity and calls processEntity() for each entity every time the
 * EntitySystem is updated. This is really just a convenience class as most systems iterate over a list of entities.
 */
export abstract class IteratingSystem extends EntitySystem {
	private readonly family: Family;
	private entities: Entity[] = [];

	/**
	 * @param family The family of entities iterated over in this System
	 * @param priority The priority to execute this system with (lower means higher priority).
	 */
	public constructor(family: Family, priority: number = 0) {
		super(priority);
		this.family = family;
	}

	public update(deltaTime: number): void {
		for (let entity of this.entities)
			this.processEntity(entity, deltaTime);
	}

	protected addedToEngine(engine: Engine): void {
		super.addedToEngine(engine);
		this.entities = engine.getEntitiesFor(this.family);
	}

	protected removedFromEngine(engine: Engine): void {
		super.removedFromEngine(engine);
		this.entities = [];
	}

	/** @return A list of entities processed by the system */
	public getEntities(): Entity[] {
		return this.entities;
	}

	/** @return The Family used when the system was created */
	public getFamily(): Family {
		return this.family;
	}

	/**
	 * This method is called on every entity on every update call of the EntitySystem.
	 * Override this to implement your system's specific processing.
	 *
	 * @param entity The current Entity being processed
	 * @param deltaTime The delta time between the last and current frame
	 */
	protected abstract processEntity(entity: Entity, deltaTime: number): void;
}
