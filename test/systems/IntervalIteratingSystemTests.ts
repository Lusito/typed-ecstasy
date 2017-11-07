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
import { Component } from "../../src/core/Component";
import { Entity } from "../../src/core/Entity";
import { Engine } from "../../src/core/Engine";
import { Family } from "../../src/core/Family";
import { IntervalIteratingSystem } from "../../src/systems/IntervalIteratingSystem";

const deltaTime = 0.1;

class IntervalComponentSpy extends Component {
	numUpdates = 0;
}

class IntervalIteratingSystemSpy extends IntervalIteratingSystem {
	public constructor(priority?: number) {
		super(Family.all(IntervalComponentSpy).get(), deltaTime * 2.0, priority);
	}

	protected processEntity(entity: Entity): void {
		let component = entity.get<IntervalComponentSpy>(IntervalComponentSpy);
		assert.isNotNull(component);
		if (component)
			component.numUpdates++;
	}
}

@suite export class IntervalIteratingSystemTests {

	@test()
	public priority() {
		let system = new IntervalIteratingSystemSpy();
		assert.strictEqual(system.getPriority(), 0);
		system = new IntervalIteratingSystemSpy(10);
		assert.strictEqual(system.getPriority(), 10);
		system.setPriority(13);
		assert.strictEqual(system.getPriority(), 13);
	}

	@test sameEntitiesAndFamily() {
		let engine = new Engine();
		let family = Family.all(IntervalComponentSpy).get();
		let entities = engine.getEntitiesFor(family);

		let system = engine.addSystem(new IntervalIteratingSystemSpy());
		let systemEntities = system.getEntities();

		assert.strictEqual(entities, systemEntities);
		assert.strictEqual(system.getFamily(), family);
	}

	@test()
	public intervalIteratingSystem() {
		let engine = new Engine();
		let entities = engine.getEntitiesFor(Family.all(IntervalComponentSpy).get());

		engine.addSystem(new IntervalIteratingSystemSpy());

		for (let i = 0; i < 10; ++i) {
			let entity = engine.createEntity();
			entity.add(new IntervalComponentSpy());
			engine.addEntity(entity);
		}

		for (let i = 1; i <= 10; ++i) {
			engine.update(deltaTime);

			for (let e of entities) {
				let component = e.get<IntervalComponentSpy>(IntervalComponentSpy);
				assert.isNotNull(component);
				if (component)
					assert.strictEqual(Math.floor(i / 2), component.numUpdates);
			}
		}
		engine.destroy();
	}

	@test testGetInterval() {
		let system = new IntervalIteratingSystemSpy();
		assert.strictEqual(system.getInterval(), deltaTime * 2.0);
	}
}
