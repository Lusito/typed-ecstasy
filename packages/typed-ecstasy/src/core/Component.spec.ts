import { Component } from "typed-ecstasy";

class ComponentA extends Component {}
class ComponentB extends Component {}

describe("Component", () => {
    const a = new ComponentA();
    const b = new ComponentB();
    test("#getComponentClass() should return the component class", () => {
        expect(a.getComponentClass()).toBe(ComponentA);
        expect(b.getComponentClass()).toBe(ComponentB);
    });
    test("#is() should return true for matching component classes", () => {
        expect(a.is(ComponentA)).toBe(true);
        expect(a.is(ComponentB)).toBe(false);
        expect(b.is(ComponentB)).toBe(true);
        expect(b.is(ComponentA)).toBe(false);
    });
});
