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
import { EntitySystem } from "../../src/core/EntitySystem";

const deltaTime = 0.16;
class ComponentA extends Component { }
class ComponentB extends Component { }
class ComponentC extends Component { }

class EntityListenerMock {
	addedCount = 0;
	removedCount = 0;

	public entityAdded(entity: Entity): void {
		++this.addedCount;
		assert.isNotNull(entity);
	}

	public entityRemoved(entity: Entity): void {
		++this.removedCount;
		assert.isNotNull(entity);
	}
}

class MockLog {
	updateCalls = 0;
	addedCalls = 0;
	removedCalls = 0;
}

abstract class EntitySystemMockBase extends EntitySystem {
	log = new MockLog();
	updates: number[] | null = [];

	constructor(log: MockLog, updates: number[] | null = null) {
		super();
		this.log = log;
		this.updates = updates;
	}

	public update(deltaTime: number): void {
		++this.log.updateCalls;

		if (this.updates != null)
			this.updates.push(this.getPriority());
	}

	protected addedToEngine(engine: Engine): void {
		super.addedToEngine(engine);
		++this.log.addedCalls;

		assert.isNotNull(engine);
	}

	protected removedFromEngine(engine: Engine): void {
		super.removedFromEngine(engine);
		++this.log.removedCalls;

		assert.isNotNull(engine);
	}
}
class EntitySystemMock extends EntitySystemMockBase {
	constructor(log: MockLog) { super(log); }
}

class EntitySystemMockA extends EntitySystemMockBase {
	constructor(log: MockLog, updates: number[] | null = null) { super(log, updates); }
}

class EntitySystemMockB extends EntitySystemMockBase {
	constructor(log: MockLog, updates: number[] | null = null) { super(log, updates); }
}

class CounterComponent extends Component {
	counter = 0;
}

class CounterSystem extends EntitySystem {
	entities: Entity[];
	constructor() { super(); }

	protected addedToEngine(engine: Engine): void {
		super.addedToEngine(engine);
		this.entities = engine.getEntitiesFor(Family.all(CounterComponent).get());
	}

	public update(deltaTime: number) {
		let engine = this.getEngine();
		if (!engine)
			return;
		for (let i = 0; i < this.entities.length; ++i) {
			let e = this.entities[i];
			if (i % 2 == 0) {
				let cc = e.get(CounterComponent);
				assert.isNotNull(cc);
				if (cc)
					cc.counter++;
			} else {
				engine.removeEntity(e);
				assert.isTrue(e.isScheduledForRemoval());
			}
		}
	}
}

class UpdateCheckSystem extends EntitySystem {
	wasUpdating = false;
	constructor() { super(); }

	public update(deltaTime: number) {
		let engine = this.getEngine();
		if (engine)
			this.wasUpdating = engine.isUpdating();
	}
}

class RemoveAllDuringUpdateSystem extends EntitySystem {
	constructor() { super(); }

	public update(deltaTime: number) {
		let engine = this.getEngine();
		if (engine)
			engine.removeAllEntities();
	}
}

class PositionComponent extends Component {
	x = 0.0;
	y = 0.0;
}

class CombinedSystem extends EntitySystem {
	entities: Entity[];
	counter = 0;
	constructor() { super(); }

	protected addedToEngine(engine: Engine): void {
		super.addedToEngine(engine);
		this.entities = engine.getEntitiesFor(Family.all(PositionComponent).get());
	}

	public update(deltaTime: number): void {
		let engine = this.getEngine();
		if (engine) {
			if (this.counter >= 6 && this.counter <= 8)
				engine.removeEntity(this.entities[2]);
			this.counter++;
		}
	}
}

class RemoveEntityTwiceSystem extends EntitySystem {
	private entities: Entity[];
	constructor() { super(); }

	protected addedToEngine(engine: Engine): void {
		super.addedToEngine(engine);
		this.entities = engine.getEntitiesFor(Family.all(PositionComponent).get());
	}

	public update(deltaTime: number) {
		let engine = this.getEngine();
		if (!engine)
			return;
		for (let i = 0; i < 10; i++) {
			let entity = engine.createEntity();
			assert.strictEqual(0, entity.flags);
			entity.flags = 1;
			entity.add(new PositionComponent());
			engine.addEntity(entity);
		}
		for (let entity of this.entities) {
			engine.removeEntity(entity);
			engine.removeEntity(entity);
		}
	}
}

@suite export class EngineTests {
	@test is_updating() {
		let engine = new Engine();
		let system = engine.addSystem(new UpdateCheckSystem());
		engine.update(deltaTime);
		assert.isTrue(system.wasUpdating);
	}

	@test remove_all_during_update() {
		let engine = new Engine();
		engine.addEntity(engine.createEntity());
		engine.addEntity(engine.createEntity());
		assert.strictEqual(engine.getEntities().length, 2);
		engine.addSystem(new RemoveAllDuringUpdateSystem());
		engine.update(deltaTime);
		assert.strictEqual(engine.getEntities().length, 0);
	}


	@test addAndRemoveEntity() {
		let engine = new Engine();

		let listenerA = new EntityListenerMock();
		let listenerB = new EntityListenerMock();

		engine.entityAdded.connect(listenerA.entityAdded.bind(listenerA));
		engine.entityRemoved.connect(listenerA.entityRemoved.bind(listenerA));
		let refBAdded = engine.entityAdded.connect(listenerB.entityAdded.bind(listenerB));
		let refBRemoved = engine.entityRemoved.connect(listenerB.entityRemoved.bind(listenerB));

		let entity1 = engine.createEntity();
		engine.addEntity(entity1);

		assert.strictEqual(1, listenerA.addedCount);
		assert.strictEqual(1, listenerB.addedCount);

		refBAdded.enabled = false;
		refBRemoved.enabled = false;

		let entity2 = engine.createEntity();
		engine.addEntity(entity2);

		assert.strictEqual(2, listenerA.addedCount);
		assert.strictEqual(1, listenerB.addedCount);

		refBAdded.enabled = true;
		refBRemoved.enabled = true;

		engine.removeAllEntities();

		assert.strictEqual(2, listenerA.removedCount);
		assert.strictEqual(2, listenerB.removedCount);
	}

	@test unaddedEntity() {
		let engine = new Engine();
		let entity = engine.createEntity();
		let component = entity.add(new ComponentA());
		assert.strictEqual(entity.get(ComponentA), component);
		entity.add(component);
		assert.strictEqual(entity.get(ComponentA), component);
		entity.remove(ComponentA);
		entity.remove(ComponentA); //twice
		entity.destroy();

		entity = engine.createEntity();
		engine.removeEntity(entity);
	}

	@test removeFromDifferentEngine() {
		let engine1 = new Engine();
		let engine2 = new Engine();
		let entity = engine1.createEntity();
		engine1.addEntity(entity);
		assert.throws(() => engine2.removeEntity(entity));
	}

	@test addAndRemoveSystem() {
		let engine = new Engine();
		let logA = new MockLog();
		let logB = new MockLog();

		assert.isNull(engine.getSystem(EntitySystemMockA));
		assert.isNull(engine.getSystem(EntitySystemMockB));

		let systemA = engine.addSystem(new EntitySystemMockA(logA));
		let systemB = engine.addSystem(new EntitySystemMockB(logB));

		assert.strictEqual(engine.getSystem(EntitySystemMockA), systemA);
		assert.strictEqual(engine.getSystem(EntitySystemMockB), systemB);
		assert.strictEqual(1, logA.addedCalls);
		assert.strictEqual(1, logB.addedCalls);

		engine.removeSystem(EntitySystemMockA);
		engine.removeSystem(EntitySystemMockB);

		assert.isNull(engine.getSystem(EntitySystemMockA));
		assert.isNull(engine.getSystem(EntitySystemMockB));
		assert.strictEqual(1, logA.removedCalls);
		assert.strictEqual(1, logB.removedCalls);
	}

	@test getSystems() {
		let engine = new Engine();
		let logA = new MockLog();
		let logB = new MockLog();

		assert.strictEqual(engine.getSystems().length, 0);

		engine.addSystem(new EntitySystemMockA(logA));
		engine.addSystem(new EntitySystemMockB(logB));

		assert.strictEqual(2, engine.getSystems().length);
	}

	@test systemUpdate() {
		let engine = new Engine();
		let logA = new MockLog();
		let logB = new MockLog();

		engine.addSystem(new EntitySystemMockA(logA));
		engine.addSystem(new EntitySystemMockB(logB));

		let numUpdates = 10;

		for (let i = 0; i < numUpdates; ++i) {
			assert.strictEqual(i, logA.updateCalls);
			assert.strictEqual(i, logB.updateCalls);

			engine.update(deltaTime);

			assert.strictEqual((i + 1), logA.updateCalls);
			assert.strictEqual((i + 1), logB.updateCalls);
		}

		engine.removeSystem(EntitySystemMockB);

		for (let i = 0; i < numUpdates; ++i) {
			assert.strictEqual((i + numUpdates), logA.updateCalls);
			assert.strictEqual(numUpdates, logB.updateCalls);

			engine.update(deltaTime);

			assert.strictEqual((i + 1 + numUpdates), logA.updateCalls);
			assert.strictEqual(numUpdates, logB.updateCalls);
		}
	}

	@test systemUpdateOrder() {
		let updates: number[] = [];

		let engine = new Engine();
		let log1 = new MockLog();
		let log2 = new MockLog();

		engine.addSystem(new EntitySystemMockA(log1, updates)).setPriority(2);
		engine.addSystem(new EntitySystemMockB(log2, updates)).setPriority(1);

		engine.sortSystems();

		engine.update(deltaTime);

		let previous = Number.MIN_VALUE;

		for (let value of updates) {
			assert.isAtLeast(value, previous);
			previous = value;
		}
	}

	@test ignoreSystem() {
		let engine = new Engine();
		let log = new MockLog();

		let system = engine.addSystem(new EntitySystemMock(log));

		let numUpdates = 10;

		for (let i = 0; i < numUpdates; ++i) {
			system.setProcessing(i % 2 == 0);
			engine.update(deltaTime);
			assert.strictEqual(Math.floor(i / 2) + 1, log.updateCalls);
		}
	}

	@test entitiesForFamily() {
		let engine = new Engine();

		let family = Family.all(ComponentA, ComponentB).get();
		let familyEntities = engine.getEntitiesFor(family);

		assert.strictEqual(familyEntities.length, 0);

		let entity1 = engine.createEntity();
		let entity2 = engine.createEntity();
		let entity3 = engine.createEntity();
		let entity4 = engine.createEntity();

		entity1.add(new ComponentA());
		entity1.add(new ComponentB());

		entity2.add(new ComponentA());
		entity2.add(new ComponentC());

		entity3.add(new ComponentA());
		entity3.add(new ComponentB());
		entity3.add(new ComponentC());

		entity4.add(new ComponentA());
		entity4.add(new ComponentB());
		entity4.add(new ComponentC());

		engine.addEntity(entity1);
		engine.addEntity(entity2);
		engine.addEntity(entity3);
		engine.addEntity(entity4);

		assert.strictEqual(3, familyEntities.length);
		assert.notStrictEqual(familyEntities.indexOf(entity1), -1);
		assert.notStrictEqual(familyEntities.indexOf(entity3), -1);
		assert.notStrictEqual(familyEntities.indexOf(entity4), -1);
		assert.strictEqual(familyEntities.indexOf(entity2), -1);
	}

	@test entityForFamilyWithRemoval() {
		// Test for issue #13
		let engine = new Engine();

		let entity = engine.createEntity();
		entity.add(new ComponentA());

		engine.addEntity(entity);

		let entities = engine.getEntitiesFor(Family.all(ComponentA).get());

		assert.strictEqual(1, entities.length);
		assert.notStrictEqual(entities.indexOf(entity), -1);

		engine.removeEntity(entity);

		assert.strictEqual(entities.length, 0);
		assert.strictEqual(entities.indexOf(entity), -1);
	}

	@test entitiesForFamilyAfter() {
		let engine = new Engine();

		let family = Family.all(ComponentA, ComponentB).get();
		let familyEntities = engine.getEntitiesFor(family);

		assert.strictEqual(familyEntities.length, 0);

		let entity1 = engine.createEntity();
		let entity2 = engine.createEntity();
		let entity3 = engine.createEntity();
		let entity4 = engine.createEntity();

		engine.addEntity(entity1);
		engine.addEntity(entity2);
		engine.addEntity(entity3);
		engine.addEntity(entity4);

		entity1.add(new ComponentA());
		entity1.add(new ComponentB());

		entity2.add(new ComponentA());
		entity2.add(new ComponentC());

		entity3.add(new ComponentA());
		entity3.add(new ComponentB());
		entity3.add(new ComponentC());

		entity4.add(new ComponentA());
		entity4.add(new ComponentB());
		entity4.add(new ComponentC());

		assert.strictEqual(3, familyEntities.length);
		assert.notStrictEqual(familyEntities.indexOf(entity1), -1);
		assert.notStrictEqual(familyEntities.indexOf(entity3), -1);
		assert.notStrictEqual(familyEntities.indexOf(entity4), -1);
		assert.strictEqual(familyEntities.indexOf(entity2), -1);
	}

	@test entitiesForFamilyWithRemoval() {
		let engine = new Engine();

		let family = Family.all(ComponentA, ComponentB).get();
		let familyEntities = engine.getEntitiesFor(family);

		let entity1 = engine.createEntity();
		let entity2 = engine.createEntity();
		let entity3 = engine.createEntity();
		let entity4 = engine.createEntity();

		engine.addEntity(entity1);
		engine.addEntity(entity2);
		engine.addEntity(entity3);
		engine.addEntity(entity4);

		entity1.add(new ComponentA());
		entity1.add(new ComponentB());

		entity2.add(new ComponentA());
		entity2.add(new ComponentC());

		entity3.add(new ComponentA());
		entity3.add(new ComponentB());
		entity3.add(new ComponentC());

		entity4.add(new ComponentA());
		entity4.add(new ComponentB());
		entity4.add(new ComponentC());

		assert.strictEqual(3, familyEntities.length);
		assert.notStrictEqual(familyEntities.indexOf(entity1), -1);
		assert.notStrictEqual(familyEntities.indexOf(entity3), -1);
		assert.notStrictEqual(familyEntities.indexOf(entity4), -1);
		assert.strictEqual(familyEntities.indexOf(entity2), -1);

		entity1.remove(ComponentA);
		engine.removeEntity(entity3);

		assert.strictEqual(1, familyEntities.length);
		assert.notStrictEqual(familyEntities.indexOf(entity4), -1);
		assert.strictEqual(familyEntities.indexOf(entity1), -1);
		assert.strictEqual(familyEntities.indexOf(entity3), -1);
		assert.strictEqual(familyEntities.indexOf(entity2), -1);
	}

	@test entitiesForFamilyWithRemovalAndFiltering() {
		let engine = new Engine();

		let entitiesWithComponentAOnly = engine.getEntitiesFor(Family.all(ComponentA)
			.exclude(ComponentB).get());

		let entitiesWithComponentB = engine.getEntitiesFor(Family.all(ComponentB).get());

		let entity1 = engine.createEntity();
		let entity2 = engine.createEntity();

		engine.addEntity(entity1);
		engine.addEntity(entity2);

		entity1.add(new ComponentA());

		entity2.add(new ComponentA());
		entity2.add(new ComponentB());

		assert.strictEqual(1, entitiesWithComponentAOnly.length);
		assert.strictEqual(1, entitiesWithComponentB.length);

		entity2.remove(ComponentB);

		assert.strictEqual(2, entitiesWithComponentAOnly.length);
		assert.strictEqual(entitiesWithComponentB.length, 0);
	}

	@test entitySystemRemovalWhileIterating() {
		let engine = new Engine();

		engine.addSystem(new CounterSystem());

		for (let i = 0; i < 20; ++i) {
			let entity = engine.createEntity();
			entity.add(new CounterComponent());
			engine.addEntity(entity);
		}

		let entities = engine.getEntitiesFor(Family.all(CounterComponent).get());

		for (let e of entities) {
			let cc = e.get(CounterComponent);
			assert.isNotNull(cc);
			if (cc)
				assert.strictEqual(0, cc.counter);
		}

		engine.update(deltaTime);

		for (let e of entities) {
			let cc = e.get(CounterComponent);
			assert.isNotNull(cc);
			if (cc)
				assert.strictEqual(1, cc.counter);
		}
	}

	@test familyListener() {
		let engine = new Engine();

		let listenerA = new EntityListenerMock();
		let listenerB = new EntityListenerMock();

		let familyA = Family.all(ComponentA).get();
		let familyB = Family.all(ComponentB).get();

		engine.getEntityAddedSignal(familyA).connect(listenerA.entityAdded.bind(listenerA));
		engine.getEntityRemovedSignal(familyA).connect(listenerA.entityRemoved.bind(listenerA));

		let refBAdded = engine.getEntityAddedSignal(familyB).connect(listenerB.entityAdded.bind(listenerB));
		let refBRemoved = engine.getEntityRemovedSignal(familyB).connect(listenerB.entityRemoved.bind(listenerB));

		let entity1 = engine.createEntity();
		engine.addEntity(entity1);

		assert.strictEqual(0, listenerA.addedCount);
		assert.strictEqual(0, listenerB.addedCount);

		let entity2 = engine.createEntity();
		engine.addEntity(entity2);

		assert.strictEqual(0, listenerA.addedCount);
		assert.strictEqual(0, listenerB.addedCount);

		entity1.add(new ComponentA());

		assert.strictEqual(1, listenerA.addedCount);
		assert.strictEqual(0, listenerB.addedCount);

		entity2.add(new ComponentB());

		assert.strictEqual(1, listenerA.addedCount);
		assert.strictEqual(1, listenerB.addedCount);

		entity1.remove(ComponentA);

		assert.strictEqual(1, listenerA.removedCount);
		assert.strictEqual(0, listenerB.removedCount);

		engine.removeEntity(entity2);

		assert.strictEqual(1, listenerA.removedCount);
		assert.strictEqual(1, listenerB.removedCount);

		refBAdded.enabled = false;
		refBRemoved.enabled = false;

		entity2 = engine.createEntity();
		entity2.add(new ComponentB());
		engine.addEntity(entity2);

		assert.strictEqual(1, listenerA.addedCount);
		assert.strictEqual(1, listenerB.addedCount);

		entity1.add(new ComponentB());
		entity1.add(new ComponentA());

		assert.strictEqual(2, listenerA.addedCount);
		assert.strictEqual(1, listenerB.addedCount);

		engine.removeAllEntities();

		assert.strictEqual(2, listenerA.removedCount);
		assert.strictEqual(1, listenerB.removedCount);

		refBAdded.enabled = true;
		refBRemoved.enabled = true;
	}

	@test sameEntitySignals() {
		let familyA = Family.all(ComponentA).get();
		let familyB = Family.all(ComponentB).get();
		let engine = new Engine();
		let sigA = engine.getEntityAddedSignal(familyA);
		let sigB = engine.getEntityAddedSignal(familyB);
		assert.strictEqual(sigA, engine.getEntityAddedSignal(familyA));
		assert.strictEqual(sigB, engine.getEntityAddedSignal(familyB));
		assert.notStrictEqual(sigA, engine.getEntityAddedSignal(familyB));
	}

	@test createManyEntitiesNoStackOverflow() {
		let engine = new Engine();
		engine.addSystem(new CounterSystem());

		for (let i = 0; 15000 > i; i++) {
			let e = engine.createEntity();
			e.add(new ComponentB());
			engine.addEntity(e);
		}

		engine.update(0);
	}

	@test getEntityById() {
		let engine = new Engine();
		let entity = engine.createEntity();

		assert.strictEqual(0, entity.getId());
		assert.isFalse(entity.isValid());

		engine.addEntity(entity);

		assert.isTrue(entity.isValid());

		let entityId = entity.getId();

		assert.notStrictEqual(0, entityId);

		assert.strictEqual(entity, engine.getEntity(entityId));

		engine.removeEntity(entity);

		assert.isNull(engine.getEntity(entityId));
	}

	@test getEntities() {
		let numEntities = 10;

		let engine = new Engine();

		let entities: Entity[] = [];
		for (let i = 0; i < numEntities; ++i) {
			let entity = engine.createEntity();
			entities.push(entity);
			engine.addEntity(entity);
		}

		let engineEntities = engine.getEntities();

		assert.strictEqual(entities.length, engineEntities.length);

		for (let i = 0; i < numEntities; ++i) {
			assert.strictEqual(entities[i], engineEntities[i]);
		}

		engine.removeAllEntities();

		assert.strictEqual(engineEntities.length, 0);
	}

	@test addEntityTwice() {
		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);

		assert.throws(() => engine.addEntity(entity));
	}

	@test addTwoSystemsOfSameClass() {
		let engine = new Engine();
		let log1 = new MockLog();
		let log2 = new MockLog();

		assert.strictEqual(0, engine.getSystems().length);
		let system1 = engine.addSystem(new EntitySystemMockA(log1));

		assert.strictEqual(1, engine.getSystems().length);
		assert.strictEqual(system1, engine.getSystem(EntitySystemMockA));

		let system2 = engine.addSystem(new EntitySystemMockA(log2));

		assert.strictEqual(1, engine.getSystems().length);
		assert.strictEqual(system2, engine.getSystem(EntitySystemMockA));
	}

	@test entityRemovalListenerOrder() {
		let engine = new Engine();

		let combinedSystem = engine.addSystem(new CombinedSystem());

		let signal = engine.getEntityRemovedSignal(Family.all(PositionComponent).get());
		signal.connect((entity) => {
			assert.isNotNull(entity.get(PositionComponent));
		});

		for (let i = 0; i < 10; i++) {
			let entity = engine.createEntity();
			entity.add(new PositionComponent());
			engine.addEntity(entity);
		}

		assert.strictEqual(10, combinedSystem.entities.length);

		for (let i = 0; i < 10; i++)
			engine.update(deltaTime);

		engine.removeAllEntities();
	}

	@test removeEntityTwice() {
		let engine = new Engine();
		engine.addSystem(new RemoveEntityTwiceSystem());

		for (let j = 0; j < 2; j++)
			engine.update(0);
	}

	@test destroyEntity() {
		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);
		assert.isTrue(entity.isValid());
		entity.destroy();
	}

	@test removeEntities() {
		let engine = new Engine();

		let numEntities = 200;
		let entities: Entity[] = [];

		for (let i = 0; i < numEntities; ++i) {
			let entity = engine.createEntity();
			engine.addEntity(entity);
			entities.push(entity);

			assert.isTrue(entity.isValid());
		}

		for (let entity of entities) {
			engine.removeEntity(entity);
		}
	}
}
