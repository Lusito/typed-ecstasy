import { ComponentBlueprint } from "./ComponentBlueprint";

describe("Blueprint", () => {
    test("test_component_blueprint_getters_default", () => {
        const blueprint = new ComponentBlueprint("test");
        expect(blueprint.getBool("undefined", false)).toBe(false);
        expect(blueprint.getBool("undefined", true)).toBe(true);
        expect(blueprint.getNumber("undefined", 42)).toBe(42);
        expect(blueprint.getNumber("undefined", 3.14)).toBe(3.14);
        expect(blueprint.getString("undefined", "paranoid android")).toBe("paranoid android");
        expect(blueprint.getAny("any", [0, 1])).toHaveSameOrderedMembers([0, 1]);
    });

    test("test_component_blueprint_getters_invalid", () => {
        const blueprint = new ComponentBlueprint("test");
        blueprint.set("bool", "");
        expect(blueprint.getBool("bool", true)).toBe(true);
        expect(blueprint.getBool("bool", false)).toBe(false);
        blueprint.set("bool", "1");
        expect(blueprint.getBool("bool", true)).toBe(true);
        expect(blueprint.getBool("bool", false)).toBe(false);

        blueprint.set("int", "");
        expect(blueprint.getNumber("int", 42)).toBe(42);
        blueprint.set("int", "invalid");
        expect(blueprint.getNumber("int", 42)).toBe(42);

        blueprint.set("float", "");
        expect(blueprint.getNumber("float", 42)).toBe(42);
        blueprint.set("float", "invalid");
        expect(blueprint.getNumber("float", 42)).toBe(42);

        blueprint.set("string", 15);
        expect(blueprint.getString("string", "hello")).toBe("hello");
    });

    test("test_component_blueprint_getters", () => {
        const blueprint = new ComponentBlueprint("test");
        blueprint.set("bool", true);
        expect(blueprint.getBool("bool", false)).toBe(true);
        blueprint.set("bool", false);
        expect(blueprint.getBool("bool", true)).toBe(false);

        blueprint.set("int", 0);
        expect(blueprint.getNumber("int", 42)).toBe(0);
        blueprint.set("int", 12345);
        expect(blueprint.getNumber("int", 42)).toBe(12345);
        blueprint.set("int", -12345);
        expect(blueprint.getNumber("int", 42)).toBe(-12345);

        blueprint.set("float", 0);
        expect(blueprint.getNumber("float", 42)).toBe(0);
        blueprint.set("float", 0.12345);
        expect(blueprint.getNumber("float", 42)).toBe(0.12345);
        blueprint.set("float", 1.2345);
        expect(blueprint.getNumber("float", 42)).toBe(1.2345);
        blueprint.set("float", -1.2345);
        expect(blueprint.getNumber("float", 42)).toBe(-1.2345);

        blueprint.set("string", "hello world");
        expect(blueprint.getString("string", "foo bar")).toBe("hello world");

        blueprint.set("any", [0, 1]);
        expect(blueprint.getAny("any", [2, 3])).toHaveSameOrderedMembers([0, 1]);
    });

    test("test_component_blueprint_getters_with_overrides", () => {
        const blueprint = new ComponentBlueprint("test");
        blueprint.setOverrides({
            bool: false,
            int: 1337,
            float: 3.14,
            string: "halloween",
            any: [4, 5],
        });
        blueprint.set("bool", true);
        expect(blueprint.getBool("bool", false)).toBe(false);

        blueprint.set("int", 0);
        expect(blueprint.getNumber("int", 42)).toBe(1337);

        blueprint.set("float", 0);
        expect(blueprint.getNumber("float", 42)).toBe(3.14);

        blueprint.set("string", "hello world");
        expect(blueprint.getString("string", "foo bar")).toBe("halloween");

        blueprint.set("any", [0, 1]);
        expect(blueprint.getAny("any", [2, 3])).toHaveSameOrderedMembers([4, 5]);
    });

    test("test_component_blueprint_getters_with_invalid_overrides", () => {
        const blueprint = new ComponentBlueprint("test");
        blueprint.setOverrides({
            bool: null,
            int: null,
            float: null,
            string: null,
        });
        blueprint.set("bool", true);
        expect(blueprint.getBool("bool", false)).toBe(true);

        blueprint.set("int", 1);
        expect(blueprint.getNumber("int", 42)).toBe(1);

        blueprint.set("float", 1);
        expect(blueprint.getNumber("float", 42)).toBe(1);

        blueprint.set("string", "hello world");
        expect(blueprint.getString("string", "foo bar")).toBe("hello world");
    });
});
