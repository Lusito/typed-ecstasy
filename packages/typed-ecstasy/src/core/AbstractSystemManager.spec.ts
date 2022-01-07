/* eslint-disable dot-notation */
import { AbstractSystem, AbstractSystemManager, Engine, service, addMetaData } from "typed-ecstasy";

class TestSystem extends AbstractSystem<TestSystem, any> {}

@service()
class TestSystemManager extends AbstractSystemManager<TestSystem> {}

@addMetaData
abstract class SystemMockBase extends TestSystem {
    public constructor(engine: Engine) {
        super(engine);
        this.onEnable = jest.fn();
        this.onDisable = jest.fn();
    }

    public update() {}
}

@service()
class SystemMockA extends SystemMockBase {}

@service()
class SystemMockB extends SystemMockBase {}

describe("SystemManager", () => {
    const createSystems = () => new Engine().container.get(TestSystemManager);

    test("addAndRemoveSystem", () => {
        const systems = createSystems();

        expect(systems.get(SystemMockA)).toBeUndefined();
        expect(systems.get(SystemMockB)).toBeUndefined();

        const systemA = systems.add(SystemMockA);
        const systemB = systems.add(SystemMockB);

        expect(systems.get(SystemMockA)).toBe(systemA);
        expect(systems.get(SystemMockB)).toBe(systemB);
        expect(systemA["onEnable"]).toHaveBeenCalledTimes(1);
        expect(systemB["onEnable"]).toHaveBeenCalledTimes(1);

        systems.remove(SystemMockA);
        systems.remove(SystemMockB);

        expect(systems.get(SystemMockA)).toBeUndefined();
        expect(systems.get(SystemMockB)).toBeUndefined();
        expect(systemA["onEnable"]).toHaveBeenCalledTimes(1);
        expect(systemB["onDisable"]).toHaveBeenCalledTimes(1);
    });

    test("getAll", () => {
        const systems = createSystems();
        expect(systems.getAll()).toHaveLength(0);

        systems.add(SystemMockA);
        systems.add(SystemMockB);

        expect(systems.getAll()).toHaveLength(2);
    });

    test("addTwoSystemsOfSameClass", () => {
        const systems = createSystems();

        expect(systems.getAll()).toHaveLength(0);
        const system1 = systems.add(SystemMockA);

        expect(systems.getAll()).toHaveLength(1);
        expect(systems.get(SystemMockA)).toBe(system1);

        const system2 = systems.add(SystemMockA);

        expect(systems.getAll()).toHaveLength(1);
        expect(systems.get(SystemMockA)).toBe(system2);
    });
});
