/* eslint-disable dot-notation */
import { Component, Poolable, PoolAllocator } from "typed-ecstasy";

import { Entity } from "../core/Entity";

class ComponentA extends Component implements Poolable {
    public value = "initialA";

    public reset() {
        this.value = "resettedA";
    }
}

class ComponentB extends Component implements Poolable {
    public value = "initialB";

    public reset() {
        this.value = "resettedB";
    }
}

class ComponentC extends Component implements Poolable {
    public value = "initialC";

    public reset() {
        this.value = "resettedC";
    }
}

describe("PoolAllocator", () => {
    it("should pass the config correctly to the pools", () => {
        const allocator = new PoolAllocator({
            maxEntities: 1,
            maxComponentsDefault: 2,
            maxComponentPerType: [
                [ComponentA, 3],
                [ComponentB, 4],
            ],
        });
        expect(allocator["entityPool"]["max"]).toBe(1);
        expect(allocator["componentPools"].get(ComponentA)!["max"]).toBe(3);
        expect(allocator["componentPools"].get(ComponentB)!["max"]).toBe(4);
        expect(allocator["componentPools"].size).toBe(2);
        expect(allocator["componentPools"].get(ComponentC)).toBeUndefined();
        allocator.obtainComponent(ComponentC);
        expect(allocator["componentPools"].get(ComponentC)!["max"]).toBe(2);
    });

    it("should use the default config if nothing is provides", () => {
        const allocator = new PoolAllocator();
        expect(allocator["entityPool"]["max"]).toBe(Number.MAX_SAFE_INTEGER);
        expect(allocator["componentPools"].size).toBe(0);
        allocator.obtainComponent(ComponentA);
        expect(allocator["componentPools"].get(ComponentA)!["max"]).toBe(Number.MAX_SAFE_INTEGER);
    });

    it("work for entities", () => {
        const allocator = new PoolAllocator();
        const a = allocator.obtainComponent(ComponentA);
        const b = allocator.obtainComponent(ComponentB);
        const c = allocator.obtainComponent(ComponentC);
        const e = allocator.obtainEntity();
        expect(a.value).toBe("initialA");
        expect(b.value).toBe("initialB");
        expect(c.value).toBe("initialC");
        expect(e.flags).toBe(0);

        a.value = "updatedA";
        b.value = "updatedB";
        c.value = "updatedC";
        e.flags = 1;

        allocator.freeComponent(a);
        allocator.freeComponent(b);
        allocator.freeComponent(c);
        allocator.freeEntity(e);

        expect(c).toBe(allocator.obtainComponent(ComponentC));
        expect(b).toBe(allocator.obtainComponent(ComponentB));
        expect(a).toBe(allocator.obtainComponent(ComponentA));
        expect(e).toBe(allocator.obtainEntity());
    });

    it("should not free normal entities", () => {
        const allocator = new PoolAllocator();
        const e = new Entity();
        allocator.freeEntity(e);
        expect(allocator.obtainEntity()).not.toBe(e);
    });
});
