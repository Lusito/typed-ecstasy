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
import { UniqueType } from "../../src/core/UniqueType";
import { Engine } from "../../src/core/Engine";
import { Bits } from "../../src/utils/Bits";

class ComponentA extends Component { }
class ComponentB extends Component { }

@suite export class EntityTests {

	@test uniqueIndex() {
		let numEntities = 10000;
		let ids = new Bits(numEntities + 1);
		let engine = new Engine();

		for (let i = 0; i < numEntities; ++i) {
			let entity = engine.createEntity();
			engine.addEntity(entity);
			assert.isFalse(ids.getAndSet(entity.getId()));
		}
	}

	@test noComponents() {
		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);

		assert.strictEqual(entity.getAll().length, 0);
		assert.isTrue(entity.getComponentBits().isEmpty());
		assert.isNull(entity.get<ComponentA>(ComponentA));
		assert.isNull(entity.get<ComponentB>(ComponentB));
		assert.isFalse(entity.has(ComponentA));
		assert.isFalse(entity.has(ComponentB));
	}

	@test addAndRemoveComponent() {
		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);

		entity.add(new ComponentA());

		assert.strictEqual(1, entity.getAll().length);

		let componentBits = entity.getComponentBits();
		let componentAIndex = UniqueType.getForClass(ComponentA).getIndex();

		for (let i = 0; i < componentBits.length(); ++i) {
			assert.strictEqual((i == componentAIndex), componentBits.get(i));
		}

		assert.isNotNull(entity.get<ComponentA>(ComponentA));
		assert.isNull(entity.get<ComponentB>(ComponentB));
		assert.isTrue(entity.has(ComponentA));
		assert.isFalse(entity.has(ComponentB));

		entity.remove(ComponentA);

		assert.strictEqual(0, entity.getAll().length);

		for (let i = 0; i < componentBits.length(); ++i) {
			assert.isFalse(componentBits.get(i));
		}

		assert.isNull(entity.get<ComponentA>(ComponentA));
		assert.isNull(entity.get<ComponentB>(ComponentB));
		assert.isFalse(entity.has(ComponentA));
		assert.isFalse(entity.has(ComponentB));
	}

	@test addAndRemoveAllComponents() {
		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);
		entity.add(new ComponentA());
		entity.add(new ComponentB());

		assert.strictEqual(2, entity.getAll().length);

		let componentBits = entity.getComponentBits();
		let componentAIndex = UniqueType.getForClass(ComponentA).getIndex();
		let componentBIndex = UniqueType.getForClass(ComponentB).getIndex();

		for (let i = 0; i < componentBits.length(); ++i) {
			assert.strictEqual((i == componentAIndex || i == componentBIndex), componentBits.get(i));
		}

		assert.isNotNull(entity.get<ComponentA>(ComponentA));
		assert.isNotNull(entity.get<ComponentB>(ComponentB));
		assert.isTrue(entity.has(ComponentA));
		assert.isTrue(entity.has(ComponentB));

		entity.removeAll();

		assert.strictEqual(0, entity.getAll().length);

		for (let i = 0; i < componentBits.length(); ++i) {
			assert.isFalse(componentBits.get(i));
		}

		assert.isNull(entity.get<ComponentA>(ComponentA));
		assert.isNull(entity.get<ComponentB>(ComponentB));
		assert.isFalse(entity.has(ComponentA));
		assert.isFalse(entity.has(ComponentB));
	}

	@test addSameComponent() {
		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);

		let a1 = entity.add(new ComponentA());
		let a2 = entity.add(new ComponentA());

		assert.strictEqual(1, entity.getAll().length);
		assert.isTrue(entity.has(ComponentA));
		assert.notStrictEqual(a1, entity.get<ComponentA>(ComponentA));
		assert.strictEqual(a2, entity.get<ComponentA>(ComponentA));
	}

	@test getComponentByClass() {
		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);

		let compA = entity.add(new ComponentA());
		let compB = entity.add(new ComponentB());

		let retA = entity.get<ComponentA>(ComponentA);
		let retB = entity.get<ComponentB>(ComponentB);

		assert.isNotNull(retA);
		assert.isNotNull(retB);

		assert.strictEqual(retA, compA);
		assert.strictEqual(retB, compB);
	}
}
