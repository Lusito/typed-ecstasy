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

import { Entity } from "../core/Entity";
import { Engine } from "../core/Engine";
import { Family } from "../core/Family";
import { EntitySystem } from "../core/EntitySystem";

/**
 * A simple EntitySystem that processes a Family of entities not once per frame, but after a given interval.
 * Entity processing logic should be placed in processEntity().
 */
export abstract class IntervalIteratingSystem extends EntitySystem {
	private readonly family: Family;
	private entities: Entity[] = [];
	private readonly interval: number;
	private accumulator: number = 0;

	/**
	 * @param family Represents the collection of family the system should process
	 * @param interval time in seconds between calls to updateInterval().
	 * @param priority The priority to execute this system with (lower means higher priority).
	 */
	public constructor(family: Family, interval: number, priority: number = 0) {
		super(priority);
		this.family = family;
		this.interval = interval;
	}

	protected addedToEngine(engine: Engine): void {
		super.addedToEngine(engine);
		this.entities = engine.getEntitiesFor(this.family);
	}

	protected removedFromEngine(engine: Engine): void {
		super.removedFromEngine(engine);
		this.entities = [];
	}

	/**
	 * The processing logic of the system should be placed here.
	 */
	protected updateInterval(): void {
		for (let entity of this.entities) {
			this.processEntity(entity);
		}
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
	 * The user should place the entity processing logic here.
	 *
	 * @param entity The entity to be processed
	 */
	protected abstract processEntity(entity: Entity): void;

	/** @return time in seconds between calls to updateInterval(). */
	public getInterval(): number {
		return this.interval;
	}

	public update(deltaTime: number): void {
		this.accumulator += deltaTime;

		while (this.accumulator >= this.interval) {
			this.accumulator -= this.interval;
			this.updateInterval();
		}
	}
}
