/* eslint-disable dot-notation */
import { Component, Poolable, Engine, PoolAllocator } from "typed-ecstasy";

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

describe("PooledEntity", () => {
    it("should reset correctly", () => {
        const allocator = new PoolAllocator();
        const engine = new Engine(allocator);
        const entity = allocator.obtainEntity();
        const a = entity.add(allocator.obtainComponent(ComponentA));
        const b = entity.add(allocator.obtainComponent(ComponentB));
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
        expect(allocator.obtainComponent(ComponentA)).toBe(a);
        expect(allocator.obtainComponent(ComponentA)).not.toBe(a);
        expect(allocator.obtainComponent(ComponentB)).toBe(b);
        expect(allocator.obtainComponent(ComponentB)).not.toBe(b);

        engine.entities.add(entity);
        expect(entity.getId()).toBeGreaterThan(entityId);
    });

    it("should reset correctly for a single component", () => {
        const allocator = new PoolAllocator();
        const entity = allocator.obtainEntity();
        const a = entity.add(allocator.obtainComponent(ComponentA));
        entity.remove(ComponentA);
        expect(a.value).toBe("resettedA");
    });
});
