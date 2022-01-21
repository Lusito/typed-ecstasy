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

    test("isComponent() should return true for matching component classes", () => {
        expect(a.isInstanceOf(ComponentA)).toBe(true);
        expect(a.isInstanceOf(ComponentB)).toBe(false);
        expect(b.isInstanceOf(ComponentB)).toBe(true);
        expect(b.isInstanceOf(ComponentA)).toBe(false);
    });
});
