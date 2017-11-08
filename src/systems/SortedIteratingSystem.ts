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
import { SignalConnections } from "typed-signals";


/**
 * A comparator for entities.
 * 
 * @see Array.sort()
 */
export type EntityComparator = (a: Entity, b: Entity) => number;

/**
 * Like IteratingSystem, but sorted using a comparator.
 * It processes each Entity of a given Family in the order specified by a comparator and
 * calls processEntity() for each Entity every time the EntitySystem is updated. This is really just a convenience
 * class as rendering systems tend to iterate over a list of entities in a sorted manner. Adding entities will cause
 * the entity list to be resorted. Call forceSort() if you changed your sorting criteria.
 */
export abstract class SortedIteratingSystem extends EntitySystem {
	private family: Family;
	private sortedEntities: Entity[] = [];
	private shouldSort = false;
	private comparator: EntityComparator;
	private connections = new SignalConnections();

	/**
	 * @param family The family of entities iterated over in this System
	 * @param comparator The comparator to sort the entities
	 * @param priority The priority to execute this system with (lower means higher priority).
	 */
	public constructor(family: Family, comparator: EntityComparator, priority: number = 0) {
		super(priority);
		this.family = family;
		this.comparator = comparator;
	}

	/**
	 * Call this if the sorting criteria have changed.
	 * The actual sorting will be delayed until the entities are processed.
	 */
	public forceSort(): void {
		this.shouldSort = true;
	}

	private sort(): void {
		if (this.shouldSort) {
			this.sortedEntities.sort(this.comparator);
			this.shouldSort = false;
		}
	}

	private entityAdded(entity: Entity): void {
		this.sortedEntities.push(entity);
		this.shouldSort = true;
	}

	private entityRemoved(entity: Entity): void {
		let index = this.sortedEntities.indexOf(entity);
		if (index !== -1) {
			this.sortedEntities.splice(index, 1);
			this.shouldSort = true;
		}
	}

	protected addedToEngine(engine: Engine): void {
		super.addedToEngine(engine);
		let newEntities = engine.getEntitiesFor(this.family);
		this.sortedEntities = [];
		if (newEntities.length) {
			for (let entity of newEntities) {
				this.sortedEntities.push(entity);
			}
			this.sortedEntities.sort(this.comparator);
		}
		this.shouldSort = false;
		this.connections.add(engine.getEntityAddedSignal(this.family).connect(this.entityAdded.bind(this)));
		this.connections.add(engine.getEntityRemovedSignal(this.family).connect(this.entityRemoved.bind(this)));
	}

	protected removedFromEngine(engine: Engine): void {
		super.removedFromEngine(engine);
		this.connections.disconnectAll();
		this.sortedEntities = [];
		this.shouldSort = false;
	}

	public update(deltaTime: number): void {
		this.sort();
		for (let entity of this.sortedEntities) {
			this.processEntity(entity, deltaTime);
		}
	}

	/**
	 * @return The set of entities processed by the system
	 */
	public getEntities(): Entity[] {
		this.sort();
		return this.sortedEntities;
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
