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
import { suite, test } from "mocha-typescript";
import { assert } from "chai";
import { Engine } from "../../src/core/Engine";
import { IntervalSystem } from "../../src/systems/IntervalSystem";

const deltaTime = 0.1;

class IntervalSystemSpy extends IntervalSystem {
	public numUpdates = 0;

	public constructor(priority?: number) {
		super(deltaTime * 2.0, priority);
	}

	protected updateInterval(): void {
		++this.numUpdates;
	}
}

@suite export class IntervalSystemTests {

	@test()
	public priority() {
		let system = new IntervalSystemSpy();
		assert.strictEqual(system.getPriority(), 0);
		system = new IntervalSystemSpy(10);
		assert.strictEqual(system.getPriority(), 10);
		system.setPriority(13);
		assert.strictEqual(system.getPriority(), 13);
	}

	@test intervalSystem() {
		let engine = new Engine();
		let intervalSystemSpy = engine.addSystem(new IntervalSystemSpy());

		for (let i = 1; i <= 10; ++i) {
			engine.update(deltaTime);
			assert.strictEqual(Math.floor(i / 2), intervalSystemSpy.numUpdates);
		}
		engine.destroy();
	}

	@test testGetInterval() {
		let intervalSystemSpy = new IntervalSystemSpy();
		assert.strictEqual(intervalSystemSpy.getInterval(), deltaTime * 2.0);
	}
}
