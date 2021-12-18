import { declareMarkerComponent } from "typed-ecstasy";

import { isComponent } from "./Component";
import { Engine } from "./Engine";

const ComponentA = declareMarkerComponent("A");
const ComponentB = declareMarkerComponent("B");

describe("Component", () => {
    const engine = new Engine();
    const a = engine.obtainComponent(ComponentA)!;
    const b = engine.obtainComponent(ComponentB)!;

    test("#componentName should return the component name", () => {
        expect(a.componentName).toBe("A");
        expect(b.componentName).toBe("B");
    });

    test("#componentId should return the component id", () => {
        expect(a.componentId).toBe(ComponentA.id);
        expect(b.componentId).toBe(ComponentB.id);
    });

    test("isComponent() should return true for matching component classes", () => {
        expect(isComponent(a, ComponentA)).toBe(true);
        expect(isComponent(a, ComponentB)).toBe(false);
        expect(isComponent(b, ComponentB)).toBe(true);
        expect(isComponent(b, ComponentA)).toBe(false);
    });
});
