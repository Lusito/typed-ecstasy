import { Engine, Component, registerComponent } from "typed-ecstasy";

class ComponentA extends Component {
    public static readonly key = "A";
}
registerComponent(ComponentA, {});

class ComponentB extends Component {
    public static readonly key = "B";
}
registerComponent(ComponentB, {});

describe("Component", () => {
    const engine = new Engine();
    const a = engine.obtainComponent(ComponentA)!;
    const b = engine.obtainComponent(ComponentB)!;

    test("isInstanceOf() should return true for matching component classes", () => {
        expect(a.isInstanceOf(ComponentA)).toBe(true);
        expect(a.isInstanceOf(ComponentB)).toBe(false);
        expect(b.isInstanceOf(ComponentB)).toBe(true);
        expect(b.isInstanceOf(ComponentA)).toBe(false);
    });

    test("isInstance() should return true for matching component classes", () => {
        expect(ComponentA.isInstance(a)).toBe(true);
        expect(ComponentB.isInstance(a)).toBe(false);
        expect(ComponentB.isInstance(b)).toBe(true);
        expect(ComponentA.isInstance(b)).toBe(false);
        expect(ComponentA.isInstance(undefined)).toBe(false);
        expect(ComponentA.isInstance(null)).toBe(false);
    });
});
