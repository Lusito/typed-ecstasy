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
import { SortedIteratingSystem } from "../../src/systems/SortedIteratingSystem";


const deltaTime = 0.16;

class ComponentB extends Component { }
class ComponentC extends Component { }

class OrderComponent extends Component {
	constructor(public name: string, public zLayer: number) { super(); }
}

class SpyComponent extends Component {
	updates = 0;
}

class IndexComponent extends Component {
	constructor(public index: number) { super(); }
}

function comparator(a: Entity, b: Entity): number {
	let ac = a.get<OrderComponent>(OrderComponent);
	let bc = b.get<OrderComponent>(OrderComponent);
	assert.isNotNull(ac);
	assert.isNotNull(bc);
	if (!ac || !bc)
		return 0;
	return ac.zLayer - bc.zLayer;
}

class SortedIteratingSystemMock extends SortedIteratingSystem {
	expectedNames: string[] = [];

	public constructor(family: Family) { super(family, comparator); }

	public update(deltaTime: number): void {
		assert.strictEqual(this.getEntities().length, this.expectedNames.length);
		super.update(deltaTime);
		assert.strictEqual(0, this.expectedNames.length);
	}

	public processEntity(entity: Entity, deltaTime: number): void {
		let component = entity.get<OrderComponent>(OrderComponent);
		assert.isNotNull(component);
		assert.notStrictEqual(0, this.expectedNames.length);
		if (component)
			assert.strictEqual(this.expectedNames[0], component.name);
		this.expectedNames.splice(0, 1);
	}
}

class IteratingComponentRemovalSystem extends SortedIteratingSystem {

	public constructor() {
		super(Family.all(SpyComponent, OrderComponent, IndexComponent).get(), comparator);
	}

	public processEntity(entity: Entity, deltaTime: number): void {
		let indexComponent = entity.get<IndexComponent>(IndexComponent);
		let spyComponent = entity.get<SpyComponent>(SpyComponent);
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

class IteratingRemovalSystem extends SortedIteratingSystem {
	public constructor(priority?: number) {
		super(Family.all(SpyComponent, IndexComponent).get(), comparator, priority);
	}

	protected processEntity(entity: Entity, deltaTime: number): void {
		let indexComponent = entity.get<IndexComponent>(IndexComponent);
		let spyComponent = entity.get<SpyComponent>(SpyComponent);
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

@suite export class SortedIteratingSystemTests {

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

		let numEntities = 10;

		for (let i = 0; i < numEntities; ++i) {
			let e = engine.createEntity();
			e.add(new SpyComponent());
			e.add(new OrderComponent("A", i));
			e.add(new IndexComponent(i + 1));

			engine.addEntity(e);
		}
		let e = engine.createEntity();
		e.add(new SpyComponent());

		engine.addEntity(e);

		assert.sameOrderedMembers(entities, systemEntities);
		assert.strictEqual(system.getFamily(), family);
	}

	@test addSystemAfterEntities() {
		let engine = new Engine();
		let family = Family.all(SpyComponent, IndexComponent).get();
		let entities = engine.getEntitiesFor(family);

		let numEntities = 10;

		for (let i = 0; i < numEntities; ++i) {
			let e = engine.createEntity();
			e.add(new SpyComponent());
			e.add(new OrderComponent("A", numEntities - i));
			e.add(new IndexComponent(i + 1));

			engine.addEntity(e);
		}
		let e = engine.createEntity();
		e.add(new SpyComponent());
		e.add(new OrderComponent("A", 0));

		engine.addEntity(e);

		let system = engine.addSystem(new IteratingRemovalSystem());
		let systemEntities = system.getEntities();
		assert.sameMembers(entities, systemEntities);
		assert.strictEqual(system.getFamily(), family);
	}

	@test shouldIterateSortedEntitiesWithCorrectFamily() {
		let engine = new Engine();

		let family = Family.all(OrderComponent, ComponentB).get();
		let system = engine.addSystem(new SortedIteratingSystemMock(family));
		let e = engine.createEntity();
		engine.addEntity(e);

		// When entity has OrderComponent
		e.add(new OrderComponent("A", 0));
		engine.update(deltaTime);

		// When entity has OrderComponent and ComponentB
		e.add(new ComponentB());
		system.expectedNames.push("A");
		engine.update(deltaTime);

		// When entity has OrderComponent, ComponentB and ComponentC
		e.add(new ComponentC());
		system.expectedNames.push("A");
		engine.update(deltaTime);

		// When entity has ComponentB and ComponentC
		e.remove(OrderComponent);
		engine.update(deltaTime);
		engine.destroy();
	}

	@test entityRemovalWhileSortedIterating() {
		let engine = new Engine();
		let entities = engine.getEntitiesFor(Family.all(SpyComponent, IndexComponent).get());

		engine.addSystem(new IteratingRemovalSystem());

		let numEntities = 10;

		for (let i = 0; i < numEntities; ++i) {
			let e = engine.createEntity();
			e.add(new SpyComponent());
			e.add(new OrderComponent(i.toString(), i));
			e.add(new IndexComponent(i + 1));

			engine.addEntity(e);
		}

		engine.update(deltaTime);

		assert.strictEqual((numEntities / 2), entities.length);

		for (let e of entities) {
			let spyComponent = e.get<SpyComponent>(SpyComponent);
			assert.isNotNull(spyComponent);
			if (spyComponent)
				assert.strictEqual(1, spyComponent.updates);
		}
	}

	@test componentRemovalWhileSortedIterating() {
		let engine = new Engine();
		let entities = engine.getEntitiesFor(Family.all(SpyComponent, IndexComponent).get());

		engine.addSystem(new IteratingComponentRemovalSystem());

		let numEntities = 10;

		for (let i = 0; i < numEntities; ++i) {
			let e = engine.createEntity();
			e.add(new SpyComponent());
			e.add(new OrderComponent(i.toString(), i));
			e.add(new IndexComponent(i + 1));

			engine.addEntity(e);
		}

		engine.update(deltaTime);

		assert.strictEqual((numEntities / 2), entities.length);

		for (let e of entities) {
			let spyComponent = e.get<SpyComponent>(SpyComponent);
			assert.isNotNull(spyComponent);
			if (spyComponent)
				assert.strictEqual(1, spyComponent.updates);
		}
	}

	createOrderEntity(name: string, zLayer: number, engine: Engine): Entity {
		let e = engine.createEntity();
		e.add(new OrderComponent(name, zLayer));
		return e;
	}

	@test entityOrder() {
		let engine = new Engine();

		let family = Family.all(OrderComponent).get();
		let system = engine.addSystem(new SortedIteratingSystemMock(family));

		let a = this.createOrderEntity("A", 0, engine);
		let b = this.createOrderEntity("B", 1, engine);
		let c = this.createOrderEntity("C", 3, engine);
		let d = this.createOrderEntity("D", 2, engine);

		engine.addEntity(a);
		engine.addEntity(b);
		engine.addEntity(c);
		system.expectedNames.push("A");
		system.expectedNames.push("B");
		system.expectedNames.push("C");
		engine.update(0);

		engine.addEntity(d);
		system.expectedNames.push("A");
		system.expectedNames.push("B");
		system.expectedNames.push("D");
		system.expectedNames.push("C");
		engine.update(0);

		let ac = a.get<OrderComponent>(OrderComponent);
		let bc = b.get<OrderComponent>(OrderComponent);
		let cc = c.get<OrderComponent>(OrderComponent);
		let dc = d.get<OrderComponent>(OrderComponent);
		assert.isNotNull(ac);
		assert.isNotNull(bc);
		assert.isNotNull(cc);
		assert.isNotNull(dc);
		if (ac) ac.zLayer = 3;
		if (bc) bc.zLayer = 2;
		if (cc) cc.zLayer = 1;
		if (dc) dc.zLayer = 0;
		system.forceSort();
		system.expectedNames.push("D");
		system.expectedNames.push("C");
		system.expectedNames.push("B");
		system.expectedNames.push("A");
		engine.update(0);
	}

	@test unknownEntityRemoved() {
		let engine = new Engine();

		let family = Family.all(OrderComponent).get();
		engine.addSystem(new SortedIteratingSystemMock(family));

		let e = engine.createEntity();
		engine.getEntityRemovedSignal(family).emit(e);
	}
}
