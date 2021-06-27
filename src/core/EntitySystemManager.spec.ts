/* eslint-disable dot-notation */
import { Service } from "typedi";
import { Engine, EntitySystem } from "typed-ecstasy";

abstract class SystemMockBase extends EntitySystem {
    public update(): void {}
}

@Service()
class SystemMockA extends SystemMockBase {}

@Service()
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

        const systemA = engine.systems.add(SystemMockA);
        const systemB = engine.systems.add(SystemMockB);
        engine.systems.removeAll();
        expect(engine.systems.add(SystemMockA)).not.toBe(systemA);
        expect(engine.systems.add(SystemMockB)).not.toBe(systemB);
    });

    it("should allow removing one system", () => {
        const engine = new Engine();

        const systemA = engine.systems.add(SystemMockA);
        engine.systems.remove(SystemMockA);
        expect(engine.systems.add(SystemMockA)).not.toBe(systemA);
    });
});
