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
import { IteratingSystem } from "../../src/systems/IteratingSystem";

class ComponentA extends Component { }
class ComponentB extends Component { }
class ComponentC extends Component { }
class ComponentD extends Component { }
class ComponentE extends Component { }
class ComponentF extends Component { }

class TestSystemA extends IteratingSystem {
	constructor(name: string) {
		super(Family.all(ComponentA).get());
	}

	protected processEntity(e: Entity, d: number): void { }
}

@suite export class FamilyTests {
	@test familyIndexOutOfBounds() {
		assert.isNull(Family.getByIndex(-1));
		assert.isNull(Family.getByIndex(99999));
	}

	@test staticBuilders() {
		let a = Family.all(ComponentA, ComponentB).one(ComponentC, ComponentD).exclude(ComponentE, ComponentE).get();
		let b = Family.one(ComponentC, ComponentD).all(ComponentA, ComponentB).exclude(ComponentE, ComponentE).get();
		let c = Family.exclude(ComponentE, ComponentE).all(ComponentA, ComponentB).one(ComponentC, ComponentD).get();
		assert.strictEqual(a, b);
		assert.strictEqual(a, c);
	}

	@test sameFamily() {
		let family1 = Family.all(ComponentA).get();
		let family2 = Family.all(ComponentA).get();
		let family3 = Family.all(ComponentA, ComponentB).get();
		let family4 = Family.all(ComponentA, ComponentB).get();
		let family5 = Family.all(ComponentA, ComponentB, ComponentC).get();
		let family6 = Family.all(ComponentA, ComponentB, ComponentC).get();
		let family7 = Family.all(ComponentA, ComponentB).one(ComponentC, ComponentD)
			.exclude(ComponentE, ComponentF).get();
		let family8 = Family.all(ComponentA, ComponentB).one(ComponentC, ComponentD)
			.exclude(ComponentE, ComponentF).get();
		let family9 = Family.all().get();
		let family10 = Family.all().get();

		assert.strictEqual(family1, family2);
		assert.strictEqual(family2, family1);
		assert.strictEqual(family3, family4);
		assert.strictEqual(family4, family3);
		assert.strictEqual(family5, family6);
		assert.strictEqual(family6, family5);
		assert.strictEqual(family7, family8);
		assert.strictEqual(family8, family7);
		assert.strictEqual(family9, family10);

		assert.strictEqual(family1.uniqueType.getIndex(), family2.uniqueType.getIndex());
		assert.strictEqual(family3.uniqueType.getIndex(), family4.uniqueType.getIndex());
		assert.strictEqual(family5.uniqueType.getIndex(), family6.uniqueType.getIndex());
		assert.strictEqual(family7.uniqueType.getIndex(), family8.uniqueType.getIndex());
		assert.strictEqual(family9.uniqueType.getIndex(), family10.uniqueType.getIndex());
	}

	@test differentFamily() {
		let family1 = Family.all(ComponentA).get();
		let family2 = Family.all(ComponentB).get();
		let family3 = Family.all(ComponentC).get();
		let family4 = Family.all(ComponentA, ComponentB).get();
		let family5 = Family.all(ComponentA, ComponentC).get();
		let family6 = Family.all(ComponentB, ComponentA).get();
		let family7 = Family.all(ComponentB, ComponentC).get();
		let family8 = Family.all(ComponentC, ComponentA).get();
		let family9 = Family.all(ComponentC, ComponentB).get();
		let family10 = Family.all(ComponentA, ComponentB, ComponentC).get();
		let family11 = Family.all(ComponentA, ComponentB).one(ComponentC, ComponentD)
			.exclude(ComponentE, ComponentF).get();
		let family12 = Family.all(ComponentC, ComponentD).one(ComponentE, ComponentF)
			.exclude(ComponentA, ComponentB).get();
		let family13 = Family.all().get();

		assert.notStrictEqual(family1, family2);
		assert.notStrictEqual(family1, family3);
		assert.notStrictEqual(family1, family4);
		assert.notStrictEqual(family1, family5);
		assert.notStrictEqual(family1, family6);
		assert.notStrictEqual(family1, family7);
		assert.notStrictEqual(family1, family8);
		assert.notStrictEqual(family1, family9);
		assert.notStrictEqual(family1, family10);
		assert.notStrictEqual(family1, family11);
		assert.notStrictEqual(family1, family12);
		assert.notStrictEqual(family1, family13);

		assert.notStrictEqual(family10, family1);
		assert.notStrictEqual(family10, family2);
		assert.notStrictEqual(family10, family3);
		assert.notStrictEqual(family10, family4);
		assert.notStrictEqual(family10, family5);
		assert.notStrictEqual(family10, family6);
		assert.notStrictEqual(family10, family7);
		assert.notStrictEqual(family10, family8);
		assert.notStrictEqual(family10, family9);
		assert.notStrictEqual(family11, family12);
		assert.notStrictEqual(family10, family13);

		assert.notStrictEqual(family1.uniqueType.getIndex(), family2.uniqueType.getIndex());
		assert.notStrictEqual(family1.uniqueType.getIndex(), family3.uniqueType.getIndex());
		assert.notStrictEqual(family1.uniqueType.getIndex(), family4.uniqueType.getIndex());
		assert.notStrictEqual(family1.uniqueType.getIndex(), family5.uniqueType.getIndex());
		assert.notStrictEqual(family1.uniqueType.getIndex(), family6.uniqueType.getIndex());
		assert.notStrictEqual(family1.uniqueType.getIndex(), family7.uniqueType.getIndex());
		assert.notStrictEqual(family1.uniqueType.getIndex(), family8.uniqueType.getIndex());
		assert.notStrictEqual(family1.uniqueType.getIndex(), family9.uniqueType.getIndex());
		assert.notStrictEqual(family1.uniqueType.getIndex(), family10.uniqueType.getIndex());
		assert.notStrictEqual(family11.uniqueType.getIndex(), family12.uniqueType.getIndex());
		assert.notStrictEqual(family1.uniqueType.getIndex(), family13.uniqueType.getIndex());
	}

	@test familyEqualityFiltering() {
		let family1 = Family.all(ComponentA).one(ComponentB).exclude(ComponentC).get();
		let family2 = Family.all(ComponentB).one(ComponentC).exclude(ComponentA).get();
		let family3 = Family.all(ComponentC).one(ComponentA).exclude(ComponentB).get();
		let family4 = Family.all(ComponentA).one(ComponentB).exclude(ComponentC).get();
		let family5 = Family.all(ComponentB).one(ComponentC).exclude(ComponentA).get();
		let family6 = Family.all(ComponentC).one(ComponentA).exclude(ComponentB).get();

		assert.strictEqual(family1, family4);
		assert.strictEqual(family2, family5);
		assert.strictEqual(family3, family6);
		assert.notStrictEqual(family1, family2);
		assert.notStrictEqual(family1, family3);
	}

	@test entityMatch() {
		let family = Family.all(ComponentA, ComponentB).get();

		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);
		entity.add(new ComponentA());
		entity.add(new ComponentB());

		assert.isTrue(family.matches(entity));

		entity.add(new ComponentC());

		assert.isTrue(family.matches(entity));
	}

	@test entityMismatch() {
		let family = Family.all(ComponentA, ComponentC).get();

		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);
		entity.add(new ComponentA());
		entity.add(new ComponentB());

		assert.isFalse(family.matches(entity));

		entity.remove(ComponentB);

		assert.isFalse(family.matches(entity));
	}

	@test entityMatchThenMismatch() {
		let family = Family.all(ComponentA, ComponentB).get();

		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);
		entity.add(new ComponentA());
		entity.add(new ComponentB());

		assert.isTrue(family.matches(entity));

		entity.remove(ComponentA);

		assert.isFalse(family.matches(entity));
	}

	@test entityMismatchThenMatch() {
		let family = Family.all(ComponentA, ComponentB).get();

		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);
		entity.add(new ComponentA());
		entity.add(new ComponentC());

		assert.isFalse(family.matches(entity));

		entity.add(new ComponentB());

		assert.isTrue(family.matches(entity));
	}

	@test testEmptyFamily() {
		let family = Family.all().get();
		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);
		assert.isTrue(family.matches(entity));
	}

	@test familyFiltering() {
		let family1 = Family.all(ComponentA, ComponentB).one(ComponentC, ComponentD)
			.exclude(ComponentE, ComponentF).get();

		let family2 = Family.all(ComponentC, ComponentD).one(ComponentA, ComponentB)
			.exclude(ComponentE, ComponentF).get();

		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);

		assert.isFalse(family1.matches(entity));
		assert.isFalse(family2.matches(entity));

		entity.add(new ComponentA());
		entity.add(new ComponentB());

		assert.isFalse(family1.matches(entity));
		assert.isFalse(family2.matches(entity));

		entity.add(new ComponentC());

		assert.isTrue(family1.matches(entity));
		assert.isFalse(family2.matches(entity));

		entity.add(new ComponentD());

		assert.isTrue(family1.matches(entity));
		assert.isTrue(family2.matches(entity));

		entity.add(new ComponentE());

		assert.isFalse(family1.matches(entity));
		assert.isFalse(family2.matches(entity));

		entity.remove(ComponentE);

		assert.isTrue(family1.matches(entity));
		assert.isTrue(family2.matches(entity));

		entity.remove(ComponentA);

		assert.isFalse(family1.matches(entity));
		assert.isTrue(family2.matches(entity));
	}

	@test matchWithEngine() {
		let engine = new Engine();
		engine.addSystem(new TestSystemA("A"));
		engine.addSystem(new TestSystemA("B"));

		let e = engine.createEntity();
		e.add(new ComponentB());
		e.add(new ComponentA());
		engine.addEntity(e);

		let f = Family.all(ComponentB).exclude(ComponentA).get();

		assert.isFalse(f.matches(e));
	}

	@test matchWithEngineInverse() {
		let engine = new Engine();

		engine.addSystem(new TestSystemA("A"));
		engine.addSystem(new TestSystemA("B"));

		let e = engine.createEntity();
		e.add(new ComponentB());
		e.add(new ComponentA());
		engine.addEntity(e);

		let f = Family.all(ComponentA).exclude(ComponentB).get();

		assert.isFalse(f.matches(e));
	}

	@test matchWithoutSystems() {
		let engine = new Engine();

		let e = engine.createEntity();
		e.add(new ComponentB());
		e.add(new ComponentA());
		engine.addEntity(e);

		let f = Family.all(ComponentB).exclude(ComponentA).get();

		assert.isFalse(f.matches(e));
	}

	@test matchWithComplexBuilding() {
		let family = Family.all(ComponentB).one(ComponentA).exclude(ComponentC).get();
		let engine = new Engine();
		let entity = engine.createEntity();
		engine.addEntity(entity);
		entity.add(new ComponentA());
		assert.isFalse(family.matches(entity));
		entity.add(new ComponentB());
		assert.isTrue(family.matches(entity));
		entity.add(new ComponentC());
		assert.isFalse(family.matches(entity));
	}
}
