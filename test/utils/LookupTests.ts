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
import { Lookup } from "../../src/utils/Lookup";

class MyData {
	getId(): string {
		return "MyData";
	}
}

class MyDerrivedData extends MyData {
	getId(): string {
		return "MyDerrivedData";
	}
}

@suite export class LookupTests {

	@test test_one_item() {
		let lookup = new Lookup();
		assert.isFalse(lookup.has(MyData));
		assert.isNull(lookup.get(MyData));
		let data = new MyData();
		assert.strictEqual(data, lookup.put(MyData, data));
		assert.isTrue(lookup.has(MyData));
		assert.strictEqual(data, lookup.get(MyData));
		lookup.remove(MyData);
		assert.isFalse(lookup.has(MyData));
		assert.isNull(lookup.get(MyData));
	}

	@test test_derrived_items() {
		let lookup = new Lookup();
		assert.isFalse(lookup.has(MyData));
		assert.isFalse(lookup.has(MyDerrivedData));
		let data = new MyData();
		assert.strictEqual(data, lookup.put(MyData, data));
		assert.strictEqual(data, lookup.get(MyData));

		let derrivedData = new MyDerrivedData();
		assert.strictEqual(derrivedData, lookup.put(MyData, derrivedData));
		assert.strictEqual(derrivedData, lookup.get(MyData));
		lookup.remove(MyData);
		assert.isNull(lookup.get(MyData));
	}
}
