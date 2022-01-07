/* eslint-disable dot-notation */
import { Engine, EntitySystem, service } from "typed-ecstasy";

abstract class SystemMockBase extends EntitySystem {
    public update(): void {}
}

@service()
class SystemMockA extends SystemMockBase {}

@service()
class SystemMockB extends SystemMockBase {}

describe("EntitySystemManager", () => {
    it("should allow updating priority", () => {
        const engine = new Engine();

        const systemA = engine.systems.add(SystemMockA, 10);
        const systemB = engine.systems.add(SystemMockB, 11);
        expect(systemA.getPriority()).toBe(10);
        expect(systemB.getPriority()).toBe(11);
        const calls: string[] = [];
        systemA.update = () => calls.push("a");
        systemB.update = () => calls.push("b");
        engine.update(0);
        expect(calls).toEqual(["a", "b"]);
        systemB.setPriority(9);
        expect(systemB.getPriority()).toBe(9);
        calls.length = 0;
        engine.update(0);
        expect(calls).toEqual(["b", "a"]);
    });

    it("should allow removing all systems", () => {
        const engine = new Engine();

        engine.systems.add(SystemMockA);
        engine.systems.add(SystemMockB);
        engine.systems.removeAll();
        expect(engine.systems.get(SystemMockA)).toBeUndefined();
        expect(engine.systems.get(SystemMockB)).toBeUndefined();
    });

    it("should allow removing one system", () => {
        const engine = new Engine();

        engine.systems.add(SystemMockA);
        engine.systems.remove(SystemMockA);
        expect(engine.systems.get(SystemMockA)).toBeUndefined();
    });
});
