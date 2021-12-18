/* eslint-disable dot-notation */
import { Engine, PoolAllocator, Entity, declareComponent } from "typed-ecstasy";

interface Data {
    value: string;
}

const ComponentA = declareComponent("A").withoutConfig<Data>({
    reset(comp) {
        comp.value = comp.value ? "resettedA" : "initialA";
    },
});

const ComponentB = declareComponent("B").withoutConfig<Data>({
    reset(comp) {
        comp.value = comp.value ? "resettedB" : "initialB";
    },
});

const ComponentC = declareComponent("C").withoutConfig<Data>({
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
                [ComponentA, 3],
                [ComponentB, 4],
            ],
        });
        const engine = new Engine(allocator);
        expect(allocator["entityPool"]["max"]).toBe(1);
        allocator.freeComponent(engine.createComponent(ComponentA)!);
        allocator.freeComponent(engine.createComponent(ComponentB)!);
        expect(allocator["componentPools"][ComponentA.id]["max"]).toBe(3);
        expect(allocator["componentPools"][ComponentB.id]["max"]).toBe(4);
        expect(allocator["componentPools"][ComponentC.id]).toBeUndefined();
        allocator.freeComponent(engine.createComponent(ComponentC)!);
        expect(allocator["componentPools"][ComponentC.id]["max"]).toBe(2);
    });

    it("should use the default config if nothing is provided", () => {
        const allocator = new PoolAllocator();
        const engine = new Engine();
        expect(allocator["entityPool"]["max"]).toBe(Number.MAX_SAFE_INTEGER);
        expect(allocator["componentPools"].length).toBe(0);
        allocator.freeComponent(engine.createComponent(ComponentA)!);
        expect(allocator["componentPools"][ComponentA.id]["max"]).toBe(Number.MAX_SAFE_INTEGER);
    });

    it("works for entities", () => {
        const allocator = new PoolAllocator();
        const engine = new Engine(allocator);
        const a = engine.createComponent(ComponentA)!;
        const b = engine.createComponent(ComponentB)!;
        const c = engine.createComponent(ComponentC)!;
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

        expect(c).toBe(engine.createComponent(ComponentC));
        expect(b).toBe(engine.createComponent(ComponentB));
        expect(a).toBe(engine.createComponent(ComponentA));
        expect(e).toBe(allocator.obtainEntity());

        expect(a.value).toBe("resettedA");
        expect(b.value).toBe("resettedB");
        expect(c.value).toBe("resettedC");
        expect(e.flags).toBe(0);
    });

    it("should not free normal entities", () => {
        const allocator = new PoolAllocator();
        const e = new Entity();
        allocator.freeEntity(e);
        expect(allocator.obtainEntity()).not.toBe(e);
    });
});
