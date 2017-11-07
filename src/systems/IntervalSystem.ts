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

/**
 * A simple EntitySystem that does not run its update logic every call to update(float), but after a
 * given interval. The actual logic should be placed in updateInterval().
 */
export abstract class IntervalSystem extends EntitySystem {
	private readonly interval: number;
	private accumulator: number = 0;

	/**
	 * @param interval time in seconds between calls to updateInterval().
	 * @param priority The priority to execute this system with (lower means higher priority).
	 */
	public constructor(interval: number, priority: number = 0) {
		super(priority);
		this.interval = interval;
	}

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

	/**
	 * The processing logic of the system should be placed here.
	 */
	protected abstract updateInterval(): void;
}
