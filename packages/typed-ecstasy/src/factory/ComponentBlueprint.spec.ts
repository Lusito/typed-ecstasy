import { ComponentBlueprint, declareMarkerComponent } from "typed-ecstasy";

const ComponentA = declareMarkerComponent("A");

describe("Blueprint", () => {
    it("should return the fallback parameter if no default values are provided", () => {
        const blueprint = new ComponentBlueprint(ComponentA.name, { undefined: undefined as any, any: undefined as any });
        expect(blueprint.get("undefined", false)).toBe(false);
        expect(blueprint.get("undefined", true)).toBe(true);
        expect(blueprint.get("undefined", 42)).toBe(42);
        expect(blueprint.get("undefined", 3.14)).toBe(3.14);
        expect(blueprint.get("undefined", "paranoid android")).toBe("paranoid android");
        expect(blueprint.get("any", [0, 1])).toHaveSameOrderedMembers([0, 1]);
    });

    it("should ignore the fallback parameter if default values are provided", () => {
        const blueprint = new ComponentBlueprint(ComponentA.name, {
            bool: true,
            int: 12345,
            float: 0.12345,
            string: "hello world",
            any: [0, 1],
        });
        expect(blueprint.get("bool", false)).toBe(true);
        expect(blueprint.get("int", 42)).toBe(12345);
        expect(blueprint.get("float", 42)).toBe(0.12345);
        expect(blueprint.get("string", "foo bar")).toBe("hello world");
        expect(blueprint.get("any", [2, 3])).toHaveSameOrderedMembers([0, 1]);
    });

    it("should ignore the fallback parameter and default values if overrides are provides", () => {
        const blueprint = new ComponentBlueprint(ComponentA.name, {
            bool: true,
            int: 12345,
            float: 0.12345,
            string: "hello world",
            any: [0, 1],
        });
        // eslint-disable-next-line dot-notation
        blueprint["setOverrides"]({
            bool: false,
            int: 1337,
            float: 3.14,
            string: "halloween",
            any: [4, 5],
        });
        expect(blueprint.get("bool", true)).toBe(false);
        expect(blueprint.get("int", 42)).toBe(1337);
        expect(blueprint.get("float", 42)).toBe(3.14);
        expect(blueprint.get("string", "foo bar")).toBe("halloween");
        expect(blueprint.get("any", [2, 3])).toHaveSameOrderedMembers([4, 5]);
    });
});
