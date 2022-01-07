import {
    service,
    Entity,
    Engine,
    Family,
    SortedSubIteratingSystem,
    SubSystem,
    declareComponent,
    declareMarkerComponent,
    SubSystemManager,
} from "typed-ecstasy";

const ComponentX = declareComponent("X").withoutConfig<{ id: number }>({
    reset(comp) {
        comp.id = 0;
    },
});

const ComponentA = declareMarkerComponent("A");
const ComponentB = declareMarkerComponent("B");

const processEntity = jest.fn();

@service()
class SubSystemA extends SubSystem {
    public processEntity = processEntity;

    public constructor(engine: Engine) {
        super(engine, Family.all(ComponentA).get());
    }
}

@service()
class SubSystemB extends SubSystem {
    public processEntity = processEntity;

    public constructor(engine: Engine) {
        super(engine, Family.all(ComponentB).get());
    }
}

@service()
class SubSystemC extends SubSystem {
    public processEntity = processEntity;

    public constructor(engine: Engine) {
        super(engine, Family.all(ComponentA, ComponentB).get());
    }
}

@service()
class TestSystem extends SortedSubIteratingSystem {
    public constructor(engine: Engine, subSystems: SubSystemManager) {
        super(
            engine,
            Family.all(ComponentX).get(),
            (a, b) => a.require(ComponentX).id - b.require(ComponentX).id,
            subSystems
        );
    }
}

describe("SortedSubIteratingSystem", () => {
    beforeEach(() => {
        processEntity.mockReset();
    });

    it("processes systems in the order they have been added and entities ordered by criteria", () => {
        const engine = new Engine();
        const system = engine.systems.add(TestSystem);
        const subA = system.subSystems.add(SubSystemA);
        const subB = system.subSystems.add(SubSystemB);
        const subC = system.subSystems.add(SubSystemC);
        const a = new Entity();
        a.add(engine.obtainComponent(ComponentX)!).id = 10;
        a.add(engine.obtainComponent(ComponentA)!);
        engine.entities.add(a);
        const b = new Entity();
        b.add(engine.obtainComponent(ComponentB)!);
        b.add(engine.obtainComponent(ComponentX)!).id = 9;
        engine.entities.add(b);
        const c = new Entity();
        c.add(engine.obtainComponent(ComponentX)!).id = 8;
        c.add(engine.obtainComponent(ComponentA)!);
        c.add(engine.obtainComponent(ComponentB)!);
        engine.entities.add(c);
        engine.update(123);
        const expected = [
            [subA, c],
            [subB, c],
            [subC, c],
            [subB, b],
            [subA, a],
        ];
        expect(processEntity).toHaveBeenCalledTimes(expected.length);
        for (let i = 0; i < expected.length; i++) {
            const [sub, e] = expected[i];
            expect(processEntity).toHaveBeenNthCalledWith(i + 1, e, 123);
            expect(processEntity.mock.instances[i]).toBe(sub);
        }
    });

    it("processes systems in the order of priority and entities ordered by criteria", () => {
        const engine = new Engine();
        const system = engine.systems.add(TestSystem);
        const subA = system.subSystems.add(SubSystemA, 3);
        const subB = system.subSystems.add(SubSystemB, 2);
        const subC = system.subSystems.add(SubSystemC, 1);
        const a = new Entity();
        a.add(engine.obtainComponent(ComponentX)!).id = 10;
        a.add(engine.obtainComponent(ComponentA)!);
        engine.entities.add(a);
        const b = new Entity();
        b.add(engine.obtainComponent(ComponentB)!);
        b.add(engine.obtainComponent(ComponentX)!).id = 9;
        engine.entities.add(b);
        const c = new Entity();
        c.add(engine.obtainComponent(ComponentX)!).id = 8;
        c.add(engine.obtainComponent(ComponentA)!);
        c.add(engine.obtainComponent(ComponentB)!);
        engine.entities.add(c);
        engine.update(123);
        const expected = [
            [subC, c],
            [subB, c],
            [subA, c],
            [subB, b],
            [subA, a],
        ];
        expect(processEntity).toHaveBeenCalledTimes(expected.length);
        for (let i = 0; i < expected.length; i++) {
            const [sub, e] = expected[i];
            expect(processEntity).toHaveBeenNthCalledWith(i + 1, e, 123);
            expect(processEntity.mock.instances[i]).toBe(sub);
        }
    });
});
