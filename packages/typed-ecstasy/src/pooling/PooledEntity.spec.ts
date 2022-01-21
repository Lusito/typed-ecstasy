/* eslint-disable dot-notation */
import { Component, Engine, PoolAllocator, registerComponent } from "typed-ecstasy";

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

describe("PooledEntity", () => {
    it("should reset correctly", () => {
        const engine = new Engine({ allocator: new PoolAllocator() });
        const entity = engine.obtainEntity();
        const a = entity.add(engine.obtainComponent(ComponentA)!);
        const b = entity.add(engine.obtainComponent(ComponentB)!);
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

        expect(engine.obtainEntity()).toBe(entity);
        expect(engine.obtainEntity()).not.toBe(entity);
        expect(engine.obtainComponent(ComponentA)!).toBe(a);
        expect(engine.obtainComponent(ComponentA)!).not.toBe(a);
        expect(engine.obtainComponent(ComponentB)!).toBe(b);
        expect(engine.obtainComponent(ComponentB)!).not.toBe(b);

        engine.entities.add(entity);
        expect(entity.getId()).toBeGreaterThan(entityId);
    });

    it("should reset correctly for a single component", () => {
        const engine = new Engine({ allocator: new PoolAllocator() });
        const entity = engine.obtainEntity();
        const a = entity.add(engine.obtainComponent(ComponentA)!);
        entity.remove(ComponentA);
        expect(a.value).toBe("resettedA");
    });
});
