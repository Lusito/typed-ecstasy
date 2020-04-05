import { Lookup } from "./Lookup";

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

describe("Lookup", () => {
    test("test_one_item", () => {
        const lookup = new Lookup();
        expect(lookup.has(MyData)).toBe(false);
        expect(lookup.get(MyData)).toBe(null);
        const data = new MyData();
        expect(lookup.put(MyData, data)).toBe(data);
        expect(lookup.has(MyData)).toBe(true);
        expect(lookup.get(MyData)).toBe(data);
        lookup.remove(MyData);
        expect(lookup.has(MyData)).toBe(false);
        expect(lookup.get(MyData)).toBe(null);
    });

    test("test_derrived_items", () => {
        const lookup = new Lookup();
        expect(lookup.has(MyData)).toBe(false);
        expect(lookup.has(MyDerrivedData)).toBe(false);
        const data = new MyData();
        expect(lookup.put(MyData, data)).toBe(data);
        expect(lookup.get(MyData)).toBe(data);

        const derrivedData = new MyDerrivedData();
        expect(lookup.put(MyData, derrivedData)).toBe(derrivedData);
        expect(lookup.get(MyData)).toBe(derrivedData);
        lookup.remove(MyData);
        expect(lookup.get(MyData)).toBe(null);
    });
});
