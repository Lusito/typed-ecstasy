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
import { ComponentBlueprint } from "../../src/utils/Blueprint";

@suite export class BlueprintTests {

	@test test_component_blueprint_getters_default() {
		let blueprint = new ComponentBlueprint("test");
		assert.isFalse(blueprint.getBool("undefined", false));
		assert.isTrue(blueprint.getBool("undefined", true));
		assert.strictEqual(blueprint.getNumber("undefined", 42), 42);
		assert.strictEqual(blueprint.getNumber("undefined", 3.14), 3.14);
		assert.strictEqual(blueprint.getString("undefined", "paranoid android"), "paranoid android");
		assert.sameOrderedMembers(blueprint.getAny("any", [0, 1]), [0, 1]);
	}

	@test test_component_blueprint_getters_invalid() {
		let blueprint = new ComponentBlueprint("test");
		blueprint.set("bool", "");
		assert.isTrue(blueprint.getBool("bool", true));
		assert.isFalse(blueprint.getBool("bool", false));
		blueprint.set("bool", "1");
		assert.isTrue(blueprint.getBool("bool", true));
		assert.isFalse(blueprint.getBool("bool", false));

		blueprint.set("int", "");
		assert.strictEqual(blueprint.getNumber("int", 42), 42);
		blueprint.set("int", "invalid");
		assert.strictEqual(blueprint.getNumber("int", 42), 42);

		blueprint.set("float", "");
		assert.strictEqual(blueprint.getNumber("float", 42), 42);
		blueprint.set("float", "invalid");
		assert.strictEqual(blueprint.getNumber("float", 42), 42);

		blueprint.set("string", 15);
		assert.strictEqual(blueprint.getString("string", "hello"), "hello");
	}

	@test test_component_blueprint_getters() {
		let blueprint = new ComponentBlueprint("test");
		blueprint.set("bool", true);
		assert.isTrue(blueprint.getBool("bool", false));
		blueprint.set("bool", false);
		assert.isFalse(blueprint.getBool("bool", true));

		blueprint.set("int", 0);
		assert.strictEqual(blueprint.getNumber("int", 42), 0);
		blueprint.set("int", 12345);
		assert.strictEqual(blueprint.getNumber("int", 42), 12345);
		blueprint.set("int", -12345);
		assert.strictEqual(blueprint.getNumber("int", 42), -12345);

		blueprint.set("float", 0);
		assert.strictEqual(blueprint.getNumber("float", 42), 0);
		blueprint.set("float", 0.12345);
		assert.strictEqual(blueprint.getNumber("float", 42), 0.12345);
		blueprint.set("float", 1.2345);
		assert.strictEqual(blueprint.getNumber("float", 42), 1.2345);
		blueprint.set("float", -1.2345);
		assert.strictEqual(blueprint.getNumber("float", 42), -1.2345);

		blueprint.set("string", "hello world");
		assert.strictEqual(blueprint.getString("string", "foo bar"), "hello world");

		blueprint.set("any", [0, 1]);
		assert.sameOrderedMembers(blueprint.getAny("any", [2, 3]), [0, 1]);
	}

	@test test_component_blueprint_getters_with_overrides() {
		let blueprint = new ComponentBlueprint("test");
		blueprint.setOverrides({
			bool: false,
			int: 1337,
			float: 3.14,
			string: "halloween",
			any: [4, 5]
		});
		blueprint.set("bool", true);
		assert.isFalse(blueprint.getBool("bool", false));

		blueprint.set("int", 0);
		assert.strictEqual(blueprint.getNumber("int", 42), 1337);

		blueprint.set("float", 0);
		assert.strictEqual(blueprint.getNumber("float", 42), 3.14);

		blueprint.set("string", "hello world");
		assert.strictEqual(blueprint.getString("string", "foo bar"), "halloween");

		blueprint.set("any", [0, 1]);
		assert.sameOrderedMembers(blueprint.getAny("any", [2, 3]), [4, 5]);
	}

	@test test_component_blueprint_getters_with_invalid_overrides() {
		let blueprint = new ComponentBlueprint("test");
		blueprint.setOverrides({
			bool: null,
			int: null,
			float: null,
			string: null
		});
		blueprint.set("bool", true);
		assert.isTrue(blueprint.getBool("bool", false));

		blueprint.set("int", 1);
		assert.strictEqual(blueprint.getNumber("int", 42), 1);

		blueprint.set("float", 1);
		assert.strictEqual(blueprint.getNumber("float", 42), 1);

		blueprint.set("string", "hello world");
		assert.strictEqual(blueprint.getString("string", "foo bar"), "hello world");
	}
}
