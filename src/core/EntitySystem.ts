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
import { Engine } from "./Engine";

/**
 * Base class for all systems. An EntitySystem is intended to process entities.
 */
export abstract class EntitySystem {
	private processing = true;
	private engine: Engine | null = null;
	private priority: number;

	/**
	 * @param priority The priority to execute this system with (lower means higher priority).
	 */
	protected constructor(priority: number = 0) {
		this.priority = priority;
	}

	/**
	 * The update method called every tick.
	 *
	 * @param deltaTime The time passed since last frame in seconds.
	 */
	public abstract update(deltaTime: number): void;

	/** @return Whether or not the system should be processed. */
	public checkProcessing(): boolean {
		return this.processing;
	}

	/**
	 * Sets whether or not the system should be processed by the Engine.
	 *
	 * @param processing true to enable, false to disable processing
	 */
	public setProcessing(processing: boolean): void {
		this.processing = processing;
	}

	/** @return The priority of the system */
	public getPriority(): number {
		return this.priority;
	}

	/**
	 * Use this to set the priority of the system. Lower means it'll get executed first.
	 *
	 * @param priority the new priority
	 */
	public setPriority(priority: number): void {
		this.priority = priority;
		if (this.engine)
			this.engine.sortSystems();
	}

	/** @return The engine */
	public getEngine() { return this.engine; }

	/**
	 * Called when this EntitySystem is added to an Engine.
	 *
	 * @param engine The Engine this system was added to.
	 */
	protected addedToEngine(engine: Engine): void {
		this.engine = engine;
	}

	/**
	 * Called when this EntitySystem is removed from an Engine.
	 *
	 * @param engine The Engine the system was removed from.
	 */
	protected removedFromEngine(engine: Engine): void {
		this.engine = null;
	}
}
