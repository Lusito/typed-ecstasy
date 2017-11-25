/*******************************************************************************
 * Copyright 2015 See AUTHORS file.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless assert.strictEquald by applicable law or agreed to in writing, software
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
import { IteratingSystem } from "../../src/systems/IteratingSystem";

const deltaTime = 0.16;

class ComponentA extends Component { }
class ComponentB extends Component { }
class ComponentC extends Component { }

class IteratingSystemMock extends IteratingSystem {
	public numUpdates = 0;

	public constructor(family: Family) {
		super(family);
	}

	protected processEntity(entity: Entity, deltaTime: number): void {
		++this.numUpdates;
	}
}

class SpyComponent extends Component {
	updates = 0;
}

class IndexComponent extends Component {
	index = 0;
	constructor(index = 0) { super(); this.index = index; }
}

class IteratingComponentRemovalSystem extends IteratingSystem {
	public constructor() {
		super(Family.all(SpyComponent, IndexComponent).get());
	}

	protected processEntity(entity: Entity, deltaTime: number): void {
		let indexComponent = entity.get(IndexComponent);
		let spyComponent = entity.get(SpyComponent);
		assert.isNotNull(indexComponent);
		assert.isNotNull(spyComponent);
		if (!indexComponent || !spyComponent)
			return;
		let index = indexComponent.index;
		if (index % 2 == 0) {
			entity.remove(SpyComponent);
			entity.remove(IndexComponent);
		} else {
			spyComponent.updates++;
		}
	}

}

class IteratingRemovalSystem extends IteratingSystem {

	public constructor(priority?: number) {
		super(Family.all(SpyComponent, IndexComponent).get(), priority);
	}

	protected addedToEngine(engine: Engine): void {
		super.addedToEngine(engine);
	}

	protected processEntity(entity: Entity, deltaTime: number): void {
		let indexComponent = entity.get(IndexComponent);
		let spyComponent = entity.get(SpyComponent);
		assert.isNotNull(indexComponent);
		assert.isNotNull(spyComponent);
		if (!indexComponent || !spyComponent)
			return;
		let index = indexComponent.index;
		if (index % 2 == 0) {
			let engine = this.getEngine();
			if (engine)
				engine.removeEntity(entity);
		} else {
			spyComponent.updates++;
		}
	}
}

@suite export class IteratingSystemTests {

	@test()
	public priority() {
		let system = new IteratingRemovalSystem();
		assert.strictEqual(system.getPriority(), 0);
		system = new IteratingRemovalSystem(10);
		assert.strictEqual(system.getPriority(), 10);
		system.setPriority(13);
		assert.strictEqual(system.getPriority(), 13);
	}

	@test sameEntitiesAndFamily() {
		let engine = new Engine();
		let family = Family.all(SpyComponent, IndexComponent).get();
		let entities = engine.getEntitiesFor(family);

		let system = engine.addSystem(new IteratingRemovalSystem());
		let systemEntities = system.getEntities();

		assert.strictEqual(entities, systemEntities);
		assert.strictEqual(system.getFamily(), family);
	}

	@test shouldIterateEntitiesWithCorrectFamily() {
		let engine = new Engine();

		let family = Family.all(ComponentA, ComponentB).get();
		let system = engine.addSystem(new IteratingSystemMock(family));
		let e = engine.createEntity();
		engine.addEntity(e);

		// When entity has ComponentA
		e.add(new ComponentA());
		engine.update(deltaTime);

		assert.strictEqual(0, system.numUpdates);

		// When entity has ComponentA and ComponentB
		system.numUpdates = 0;
		e.add(new ComponentB());
		engine.update(deltaTime);

		assert.strictEqual(1, system.numUpdates);

		// When entity has ComponentA, ComponentB and ComponentC
		system.numUpdates = 0;
		e.add(new ComponentC());
		engine.update(deltaTime);

		assert.strictEqual(1, system.numUpdates);

		// When entity has ComponentB and ComponentC
		system.numUpdates = 0;
		e.remove(ComponentA);
		engine.update(deltaTime);

		assert.strictEqual(0, system.numUpdates);
		engine.destroy();
	}

	@test entityRemovalWhileIterating() {
		let engine = new Engine();
		let entities = engine.getEntitiesFor(Family.all(SpyComponent, IndexComponent).get());

		engine.addSystem(new IteratingRemovalSystem());

		let numEntities = 10;

		for (let i = 0; i < numEntities; ++i) {
			let e = engine.createEntity();
			e.add(new SpyComponent());
			e.add(new IndexComponent(i + 1));

			engine.addEntity(e);
		}

		engine.update(deltaTime);

		assert.strictEqual((numEntities / 2), entities.length);

		for (let e of entities) {
			let spyComponent = e.get(SpyComponent);
			assert.isNotNull(spyComponent);
			if (spyComponent)
				assert.strictEqual(1, spyComponent.updates);
		}
	}

	@test componentRemovalWhileIterating() {
		let engine = new Engine();
		let entities = engine.getEntitiesFor(Family.all(SpyComponent, IndexComponent).get());

		engine.addSystem(new IteratingComponentRemovalSystem());

		let numEntities = 10;

		for (let i = 0; i < numEntities; ++i) {
			let e = engine.createEntity();
			e.add(new SpyComponent());
			e.add(new IndexComponent(i + 1));

			engine.addEntity(e);
		}

		engine.update(deltaTime);

		assert.strictEqual((numEntities / 2), entities.length);

		for (let e of entities) {
			let spyComponent = e.get(SpyComponent);
			assert.isNotNull(spyComponent);
			if (spyComponent)
				assert.strictEqual(1, spyComponent.updates);
		}
	}
}
