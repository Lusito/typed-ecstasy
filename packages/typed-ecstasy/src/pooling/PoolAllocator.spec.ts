/* eslint-disable dot-notation */
import { Engine, PoolAllocator, Entity, Component, registerComponent } from "typed-ecstasy";

class ComponentA extends Component {
    public static readonly key = "A";
    public value!: string;
}
registerComponent(ComponentA, {
    reset(comp) {
        comp.value = comp.value ? "resettedA" : "initialA";
    },
});

class ComponentB extends Component {
    public static readonly key = "B";
    public value!: string;
}
registerComponent(ComponentB, {
    reset(comp) {
        comp.value = comp.value ? "resettedB" : "initialB";
    },
});

class ComponentC extends Component {
    public static readonly key = "C";
    public value!: string;
}
registerComponent(ComponentC, {
    reset(comp) {
        comp.value = comp.value ? "resettedC" : "initialC";
    },
});

describe("PoolAllocator", () => {
    it("should pass the config correctly to the pools", () => {
        const allocator = new PoolAllocator({
            maxEntities: 1,
            maxComponentsDefault: 2,
            maxComponentPerType: [
                [ComponentA.id, 3],
                [ComponentB.id, 4],
            ],
        });
        const engine = new Engine({ allocator });
        expect(allocator["entityPool"]["max"]).toBe(1);
        allocator.freeComponent(engine.obtainComponent(ComponentA)!);
        allocator.freeComponent(engine.obtainComponent(ComponentB)!);
        expect(allocator["componentPools"][ComponentA.id]["max"]).toBe(3);
        expect(allocator["componentPools"][ComponentB.id]["max"]).toBe(4);
        expect(allocator["componentPools"][ComponentC.id]).toBeUndefined();
        allocator.freeComponent(engine.obtainComponent(ComponentC)!);
        expect(allocator["componentPools"][ComponentC.id]["max"]).toBe(2);
    });

    it("should use the default config if nothing is provided", () => {
        const allocator = new PoolAllocator();
        const engine = new Engine();
        expect(allocator["entityPool"]["max"]).toBe(Number.MAX_SAFE_INTEGER);
        expect(allocator["componentPools"].length).toBe(0);
        allocator.freeComponent(engine.obtainComponent(ComponentA)!);
        expect(allocator["componentPools"][ComponentA.id]["max"]).toBe(Number.MAX_SAFE_INTEGER);
    });

    it("works for entities", () => {
        const allocator = new PoolAllocator();
        const engine = new Engine({ allocator });
        const a = engine.obtainComponent(ComponentA)!;
        const b = engine.obtainComponent(ComponentB)!;
        const c = engine.obtainComponent(ComponentC)!;
        const e = allocator.obtainEntity();
        expect(a.value).toBe("initialA");
        expect(b.value).toBe("initialB");
        expect(c.value).toBe("initialC");
        expect(e.meta).not.toHaveProperty("marked");

        a.value = "updatedA";
        b.value = "updatedB";
        c.value = "updatedC";
        Object.assign(e.meta, { marked: true });

        allocator.freeComponent(a);
        allocator.freeComponent(b);
        allocator.freeComponent(c);
        allocator.freeEntity(e);

        expect(c).toBe(engine.obtainComponent(ComponentC));
        expect(b).toBe(engine.obtainComponent(ComponentB));
        expect(a).toBe(engine.obtainComponent(ComponentA));
        expect(e).toBe(allocator.obtainEntity());

        expect(a.value).toBe("resettedA");
        expect(b.value).toBe("resettedB");
        expect(c.value).toBe("resettedC");
        expect(e.meta).not.toHaveProperty("marked");
    });

    it("should not free normal entities", () => {
        const allocator = new PoolAllocator();
        const e = new Entity();
        allocator.freeEntity(e);
        expect(allocator.obtainEntity()).not.toBe(e);
    });
});
