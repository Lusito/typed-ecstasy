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
import { Constructor } from "../../src/utils/Constructor";

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

class MyDerrivedDataB extends MyData {
	getId(): string {
		return "MyDerrivedDataB";
	}
}

class MyDeeplyDerrivedData extends MyDerrivedData {
	getId(): string {
		return "MyDeeplyDerrivedData";
	}
}

class MyVeryDeeplyDerrivedData extends MyDeeplyDerrivedData {
	getId(): string {
		return "MyVeryDeeplyDerrivedData";
	}
}

class MyOtherData {
	getId(): string {
		return "MyOtherData";
	}
}

class MyOtherDerrivedData extends MyOtherData {
	getId(): string {
		return "MyOtherDerrivedData";
	}
}

@suite export class LookupTests {

	@test test_get_baseclass() {
		assert.strictEqual(Constructor.getBaseClass(MyDerrivedData), MyData);
		assert.strictEqual(Constructor.getBaseClass(MyData), MyData);
		assert.strictEqual(Constructor.getBaseClass(MyDerrivedDataB), MyData);
		assert.strictEqual(Constructor.getBaseClass(MyDeeplyDerrivedData), MyData);
		assert.strictEqual(Constructor.getBaseClass(MyVeryDeeplyDerrivedData), MyData);

		assert.strictEqual(Constructor.getBaseClass(MyOtherDerrivedData), MyOtherData);
		assert.strictEqual(Constructor.getBaseClass(MyOtherData), MyOtherData);
	}
}
