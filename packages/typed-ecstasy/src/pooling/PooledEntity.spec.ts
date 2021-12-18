/* eslint-disable dot-notation */
import { declareComponent, Engine, PoolAllocator } from "typed-ecstasy";

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

describe("PooledEntity", () => {
    it("should reset correctly", () => {
        const allocator = new PoolAllocator();
        const engine = new Engine(allocator);
        const entity = allocator.obtainEntity();
        const a = entity.add(engine.createComponent(ComponentA)!);
        const b = entity.add(engine.createComponent(ComponentB)!);
        expect(entity.getId()).toBe(0);
        engine.entities.add(entity);
        const entityId = entity.getId();
        expect(entityId).toBeGreaterThan(0);

        entity.flags = 1;
        expect(a.value).toBe("initialA");
        expect(b.value).toBe("initialB");

        entity.destroy();
        expect(a.value).toBe("resettedA");
        expect(b.value).toBe("resettedB");
        expect(entity.flags).toBe(0);
        expect(entity.getId()).toBe(0);
        expect(entity["manager"]).toBe(null);
        expect(entity.getAll()).toHaveLength(0);

        expect(allocator.obtainEntity()).toBe(entity);
        expect(allocator.obtainEntity()).not.toBe(entity);
        expect(engine.createComponent(ComponentA)!).toBe(a);
        expect(engine.createComponent(ComponentA)!).not.toBe(a);
        expect(engine.createComponent(ComponentB)!).toBe(b);
        expect(engine.createComponent(ComponentB)!).not.toBe(b);

        engine.entities.add(entity);
        expect(entity.getId()).toBeGreaterThan(entityId);
    });

    it("should reset correctly for a single component", () => {
        const allocator = new PoolAllocator();
        const engine = new Engine(allocator);
        const entity = allocator.obtainEntity();
        const a = entity.add(engine.createComponent(ComponentA)!);
        entity.remove(ComponentA);
        expect(a.value).toBe("resettedA");
    });
});
