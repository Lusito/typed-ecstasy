import { Component } from "./Component";
import { UniqueType } from "./UniqueType";
import { EntitySystem } from "./EntitySystem";

class ComponentA extends Component {}
class ComponentB extends Component {}

class DummySystem extends EntitySystem {
    public update(): void {}
}

class NoNameConstructor1 {}

Object.defineProperty(NoNameConstructor1, "name", { value: "" });

class NoNameConstructor2 {}

Object.defineProperty(NoNameConstructor2, "name", { value: "" });

describe("ComponentType", () => {
    test("noBaseClassName", () => {
        const type1 = UniqueType.getForClass(NoNameConstructor1);
        const type2 = UniqueType.getForClass(NoNameConstructor2);
        expect(type1).not.toBe(type2);
        expect(UniqueType.getForClass(NoNameConstructor1)).toBe(type1);
        expect(UniqueType.getForClass(NoNameConstructor2)).toBe(type2);
    });

    test("sameComponentType", () => {
        const componentType1 = UniqueType.getForClass(ComponentA);
        const componentType2 = UniqueType.getForClass(ComponentA);

        expect(componentType1).toBe(componentType2);
    });

    test("differentComponentType", () => {
        const componentType1 = UniqueType.getForClass(ComponentA);
        const componentType2 = UniqueType.getForClass(ComponentB);

        expect(componentType1).not.toBe(componentType2);
    });

    test("correctGroup", () => {
        expect(UniqueType.getForClass(ComponentA).getBaseIndex()).toBe(UniqueType.getForClass(Component as any).getIndex());
        expect(UniqueType.getForClass(ComponentB).getBaseIndex()).toBe(UniqueType.getForClass(Component as any).getIndex());
        expect(UniqueType.getForClass(DummySystem).getBaseIndex()).toBe(UniqueType.getForClass(EntitySystem as any).getIndex());
    });

    test("equals", () => {
        const a = new UniqueType(12, 1, 0);
        const b = new UniqueType(12, 1, 1);
        const c = new UniqueType(13, 1, 0);
        const d = new UniqueType(12, 2, 0);
        expect(a.equals(a)).toBe(true);
        expect(a.equals(b)).toBe(true);
        expect(b.equals(a)).toBe(true);
        expect(a.equals(c)).toBe(false);
        expect(c.equals(a)).toBe(false);
        expect(a.equals(d)).toBe(false);
        expect(d.equals(a)).toBe(false);
    });
});
