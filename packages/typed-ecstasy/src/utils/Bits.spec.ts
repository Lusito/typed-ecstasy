import { Bits } from "typed-ecstasy";

describe("Bits", () => {
    test("test_get_out_of_bounds", () => {
        const b1 = new Bits();

        b1.setAll();
        const numBits = b1.numBits();
        expect(b1.get(numBits - 1)).toBe(true);
        expect(b1.get(numBits)).toBe(false);
    });

    test("test_get_and_clear", () => {
        const b1 = new Bits();

        expect(b1.get(0)).toBe(false);
        b1.set(0);
        expect(b1.get(0)).toBe(true);
        expect(b1.getAndClear(0)).toBe(true);
        expect(b1.get(0)).toBe(false);
        const numBits = b1.numBits();
        expect(b1.getAndClear(numBits)).toBe(false);
    });

    test("test_clear", () => {
        const b1 = new Bits();
        b1.set(0);
        expect(b1.get(0)).toBe(true);
        b1.clear(0);
        expect(b1.get(0)).toBe(false);
        const numBits = b1.numBits();
        b1.clear(numBits);
        expect(b1.numBits()).toBe(numBits);
    });

    test("test_used_words", () => {
        const b1 = new Bits();
        expect(b1.usedWords()).toBe(0);
        b1.set(0);
        expect(b1.usedWords()).toBe(1);
        b1.set(32);
        expect(b1.usedWords()).toBe(2);
        b1.set(128);
        expect(b1.usedWords()).toBe(5);
        b1.clearAll();
        expect(b1.usedWords()).toBe(0);
    });

    test("test_next_set_bit", () => {
        const b1 = new Bits();
        expect(b1.nextSetBit(0)).toBe(-1);
        b1.set(0);
        expect(b1.nextSetBit(0)).toBe(0);
        b1.set(12);
        expect(b1.nextSetBit(1)).toBe(12);
        b1.setAll();
        expect(b1.nextSetBit(b1.numBits())).toBe(-1);
        b1.clearAll();
        b1.set(70);
        expect(b1.nextSetBit(0)).toBe(70);
    });

    test("test_next_clear_bit", () => {
        const b1 = new Bits();
        expect(b1.nextClearBit(0)).toBe(0);
        b1.set(0);
        expect(b1.nextClearBit(0)).toBe(1);
        b1.setAll();
        expect(b1.nextClearBit(0)).toBe(b1.numBits());
        b1.clear(12);
        expect(b1.nextClearBit(1)).toBe(12);
        b1.clearAll();
        expect(b1.nextClearBit(b1.numBits())).toBe(b1.numBits());
        b1.set(70);
        b1.setAll();
        b1.clear(70);
        expect(b1.nextClearBit(0)).toBe(70);
    });

    test("test_flip", () => {
        const b1 = new Bits();

        expect(b1.get(0)).toBe(false);
        b1.flip(0);
        expect(b1.get(0)).toBe(true);
        const numBits = b1.numBits();
        expect(b1.get(numBits)).toBe(false);
        b1.flip(numBits);
        expect(b1.get(numBits)).toBe(true);
    });

    test("test_most_significant_bits_hashcode_and_equals", () => {
        const b1 = new Bits();
        const b2 = new Bits();

        b1.set(1);
        b2.set(1);

        expect(b1.equals(b1)).toBe(true);
        expect(b2.equals(b2)).toBe(true);

        expect(b1.getStringId()).toBe(b2.getStringId());
        expect(b1.equals(b2)).toBe(true);

        // temporarily setting/clearing a single bit causing
        // the backing array to grow
        b2.set(420);
        b2.clear(420);

        expect(b1.getStringId()).toBe(b2.getStringId());
        expect(b1.equals(b2)).toBe(true);

        b1.set(810);
        b1.clear(810);

        expect(b1.getStringId()).toBe(b2.getStringId());
        expect(b1.equals(b2)).toBe(true);
        b1.set(0);
        expect(b1.equals(b2)).toBe(false);
    });

    test("test_xor", () => {
        const b1 = new Bits();
        const b2 = new Bits();
        const b3 = new Bits();

        b2.set(200);

        // b1:s array should grow to accommodate b2
        b1.xor(b2);

        expect(b1.get(200)).toBe(true);

        b1.set(1024);
        b2.xor(b1);

        expect(b2.get(1024)).toBe(true);

        b3.set(12);
        b2.xor(b3);
        expect(b2.get(12)).toBe(true);

        b2.xor(b3);
        expect(b2.get(12)).toBe(false);
    });

    test("test_or", () => {
        const b1 = new Bits();
        const b2 = new Bits();
        const b3 = new Bits();

        b2.set(200);

        // b1:s array should grow to accommodate b2
        b1.or(b2);

        expect(b1.get(200)).toBe(true);

        b1.set(1024);
        b2.or(b1);

        expect(b2.get(1024)).toBe(true);

        b3.set(12);
        b2.or(b3);
        expect(b2.get(12)).toBe(true);
    });

    test("test_and", () => {
        const b1 = new Bits();
        const b2 = new Bits();
        const b3 = new Bits();

        b2.set(200);
        // b1 should cancel b2:s bit
        b2.and(b1);

        expect(b2.get(200)).toBe(false);

        b3.and(b2);

        expect(b3.get(200)).toBe(false);

        b1.set(400);
        b1.and(b2);

        expect(b1.get(400)).toBe(false);

        b3.and(b1);

        expect(b3.get(400)).toBe(false);
    });

    test("test_and_not", () => {
        const b1 = new Bits();
        const b2 = new Bits();
        const numBits = b1.numBits();
        for (let i = 0; i < numBits; i += 2) b1.set(i);
        b2.setAll();
        b2.andNot(b1);
        for (let i = 0; i < numBits; i++) expect(b2.get(i)).toBe(!b1.get(i));
        b2.clearAll();
        b2.andNot(b1);
        expect(b2.usedWords()).toBe(0);
        b1.clearAll();
        b2.setAll();
        b2.andNot(b1);
        for (let i = 0; i < numBits; i++) expect(b2.get(i)).toBe(true);
    });

    test("test_contains_all", () => {
        const b1 = new Bits();
        const b2 = new Bits();
        expect(b1.containsAll(b2)).toBe(true);
        expect(b2.containsAll(b1)).toBe(true);
        b2.set(70);
        expect(b1.containsAll(b2)).toBe(false);
        expect(b2.containsAll(b1)).toBe(true);
        b2.clear(70);
        expect(b1.containsAll(b2)).toBe(true);
        expect(b2.containsAll(b1)).toBe(true);
        b2.set(70);
        b1.set(70);
        expect(b1.containsAll(b2)).toBe(true);
    });
});
