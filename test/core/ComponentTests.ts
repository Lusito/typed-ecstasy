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

class ComponentA extends Component { }
class ComponentB extends Component { }

@suite export class EntityTests {

	@test get_component_class() {
		let a = new ComponentA();
		assert.strictEqual(a.getComponentClass(), ComponentA);
		let b = new ComponentB();
		assert.strictEqual(b.getComponentClass(), ComponentB);
	}
	@test is() {
		let a = new ComponentA();
		assert.isTrue(a.is(ComponentA));
		assert.isFalse(a.is(ComponentB));
		let b = new ComponentB();
		assert.isTrue(b.is(ComponentB));
		assert.isFalse(b.is(ComponentA));
	}
}
