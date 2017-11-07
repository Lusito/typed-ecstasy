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
import { Bits } from "../../src/utils/Bits";

@suite export class BitsTests {

	@test()
	public test_get_out_of_bounds() {
		let b1 = new Bits();

		b1.setAll();
		let numBits = b1.numBits();
		assert.isTrue(b1.get(numBits - 1));
		assert.isFalse(b1.get(numBits));
	}

	@test()
	public test_get_and_clear() {
		let b1 = new Bits();

		assert.isFalse(b1.get(0));
		b1.set(0);
		assert.isTrue(b1.get(0));
		assert.isTrue(b1.getAndClear(0));
		assert.isFalse(b1.get(0));
		let numBits = b1.numBits();
		assert.isFalse(b1.getAndClear(numBits));
	}

	@test()
	public test_clear() {
		let b1 = new Bits();
		b1.set(0);
		assert.isTrue(b1.get(0));
		b1.clear(0);
		assert.isFalse(b1.get(0));
		let numBits = b1.numBits();
		b1.clear(numBits);
		assert.strictEqual(numBits, b1.numBits());
	}

	@test()
	public test_used_words() {
		let b1 = new Bits();
		assert.strictEqual(b1.usedWords(), 0);
		b1.set(0);
		assert.strictEqual(b1.usedWords(), 1);
		b1.set(32);
		assert.strictEqual(b1.usedWords(), 2);
		b1.set(128);
		assert.strictEqual(b1.usedWords(), 5);
		b1.clearAll();
		assert.strictEqual(b1.usedWords(), 0);
	}

	@test()
	public test_next_set_bit() {
		let b1 = new Bits();
		assert.strictEqual(b1.nextSetBit(0), -1);
		b1.set(0);
		assert.strictEqual(b1.nextSetBit(0), 0);
		b1.set(12);
		assert.strictEqual(b1.nextSetBit(1), 12);
		b1.setAll();
		assert.strictEqual(b1.nextSetBit(b1.numBits()), -1);
		b1.clearAll();
		b1.set(70);
		assert.strictEqual(b1.nextSetBit(0), 70);
	}

	@test()
	public test_next_clear_bit() {
		let b1 = new Bits();
		assert.strictEqual(b1.nextClearBit(0), 0);
		b1.set(0);
		assert.strictEqual(b1.nextClearBit(0), 1);
		b1.setAll();
		assert.strictEqual(b1.nextClearBit(0), b1.numBits());
		b1.clear(12);
		assert.strictEqual(b1.nextClearBit(1), 12);
		b1.clearAll();
		assert.strictEqual(b1.nextClearBit(b1.numBits()), b1.numBits());
		b1.set(70);
		b1.setAll();
		b1.clear(70);
		assert.strictEqual(b1.nextClearBit(0), 70);
	}

	@test()
	public test_flip() {
		let b1 = new Bits();

		assert.isFalse(b1.get(0));
		b1.flip(0);
		assert.isTrue(b1.get(0));
		let numBits = b1.numBits();
		assert.isFalse(b1.get(numBits));
		b1.flip(numBits);
		assert.isTrue(b1.get(numBits));
	}

	@test()
	public test_most_significant_bits_hashcode_and_equals() {
		let b1 = new Bits();
		let b2 = new Bits();

		b1.set(1);
		b2.set(1);

		assert.isTrue(b1.equals(b1));
		assert.isTrue(b2.equals(b2));

		assert.strictEqual(b1.getStringId(), b2.getStringId());
		assert.isTrue(b1.equals(b2));

		// temporarily setting/clearing a single bit causing
		// the backing array to grow
		b2.set(420);
		b2.clear(420);

		assert.strictEqual(b1.getStringId(), b2.getStringId());
		assert.isTrue(b1.equals(b2));

		b1.set(810);
		b1.clear(810);

		assert.strictEqual(b1.getStringId(), b2.getStringId());
		assert.isTrue(b1.equals(b2));
		b1.set(0);
		assert.isFalse(b1.equals(b2));
	}

	@test()
	public test_xor() {
		let b1 = new Bits();
		let b2 = new Bits();
		let b3 = new Bits();

		b2.set(200);

		// b1:s array should grow to accommodate b2
		b1.xor(b2);

		assert.isTrue(b1.get(200));

		b1.set(1024);
		b2.xor(b1);

		assert.isTrue(b2.get(1024));

		b3.set(12);
		b2.xor(b3);
		assert.isTrue(b2.get(12));

		b2.xor(b3);
		assert.isFalse(b2.get(12));
	}

	@test()
	public test_or() {
		let b1 = new Bits();
		let b2 = new Bits();
		let b3 = new Bits();

		b2.set(200);

		// b1:s array should grow to accommodate b2
		b1.or(b2);

		assert.isTrue(b1.get(200));

		b1.set(1024);
		b2.or(b1);

		assert.isTrue(b2.get(1024));

		b3.set(12);
		b2.or(b3);
		assert.isTrue(b2.get(12));
	}

	@test()
	public test_and() {
		let b1 = new Bits();
		let b2 = new Bits();
		let b3 = new Bits();

		b2.set(200);
		// b1 should cancel b2:s bit
		b2.and(b1);

		assert.isFalse(b2.get(200));

		b3.and(b2);

		assert.isFalse(b3.get(200));

		b1.set(400);
		b1.and(b2);

		assert.isFalse(b1.get(400));

		b3.and(b1);

		assert.isFalse(b3.get(400));
	}

	@test()
	public test_and_not() {
		let b1 = new Bits();
		let b2 = new Bits();
		let numBits = b1.numBits();
		for (let i = 0; i < numBits; i += 2)
			b1.set(i);
		b2.setAll();
		b2.andNot(b1);
		for (let i = 0; i < numBits; i++)
			assert.strictEqual(b2.get(i), !b1.get(i));
		b2.clearAll();
		b2.andNot(b1);
		assert.strictEqual(b2.usedWords(), 0);
		b1.clearAll();
		b2.setAll();
		b2.andNot(b1);
		for (let i = 0; i < numBits; i++)
			assert.isTrue(b2.get(i));
	}

	@test()
	public test_contains_all() {
		let b1 = new Bits();
		let b2 = new Bits();
		assert.isTrue(b1.containsAll(b2));
		assert.isTrue(b2.containsAll(b1));
		b2.set(70);
		assert.isFalse(b1.containsAll(b2));
		assert.isTrue(b2.containsAll(b1));
		b2.clear(70);
		assert.isTrue(b1.containsAll(b2));
		assert.isTrue(b2.containsAll(b1));
		b2.set(70);
		b1.set(70);
		assert.isTrue(b1.containsAll(b2));
	}
}
