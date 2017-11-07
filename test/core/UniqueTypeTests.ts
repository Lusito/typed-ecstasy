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
import { EntitySystem } from "../../src/core/EntitySystem";

class ComponentA extends Component { }
class ComponentB extends Component { }

class DummySystem extends EntitySystem {
	public constructor() {
		super();
	}
	public update(deltaTime: number): void {
	}
}

class NoNameConstructor {
	index: 0;
}
delete (NoNameConstructor as any).name;

@suite export class ComponentTypeTests {

	@test noBaseClassName() {
		assert.throws(() => UniqueType.getForClass(NoNameConstructor));
	}

	@test sameComponentType() {
		let componentType1 = UniqueType.getForClass(ComponentA);
		let componentType2 = UniqueType.getForClass(ComponentA);

		assert.strictEqual(componentType1, componentType2);
	}

	@test differentComponentType() {
		let componentType1 = UniqueType.getForClass(ComponentA);
		let componentType2 = UniqueType.getForClass(ComponentB);

		assert.notStrictEqual(componentType1, componentType2);
	}

	@test correctGroup() {
		assert.strictEqual(UniqueType.getForClass(ComponentA).getGroup(), "Component");
		assert.strictEqual(UniqueType.getForClass(ComponentB).getGroup(), "Component");
		assert.strictEqual(UniqueType.getForClass(DummySystem).getGroup(), "EntitySystem");
	}

	@test equals() {
		let a = new UniqueType(12, "Dummy");
		let b = new UniqueType(12, "Dummy");
		let c = new UniqueType(13, "Dummy");
		let d = new UniqueType(12, "Dummy2");
		assert.isTrue(a.equals(a));
		assert.isTrue(a.equals(b));
		assert.isTrue(b.equals(a));
		assert.isFalse(a.equals(c));
		assert.isFalse(c.equals(a));
		assert.isFalse(a.equals(d));
		assert.isFalse(d.equals(a));
	}
}
