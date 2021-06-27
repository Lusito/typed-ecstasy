import { Service } from "typedi";
import { Component, Entity, Engine, Family, SortedSubIteratingSystem, SubSystem } from "typed-ecstasy";

class ComponentX extends Component {
    public constructor(public id = 0) {
        super();
    }
}
class ComponentA extends Component {}
class ComponentB extends Component {}

const processEntity = jest.fn();

@Service()
class SubSystemA extends SubSystem {
    public processEntity = processEntity;

    public constructor() {
        super(Family.all(ComponentA).get());
    }
}

@Service()
class SubSystemB extends SubSystem {
    public processEntity = processEntity;

    public constructor() {
        super(Family.all(ComponentB).get());
    }
}

@Service()
class SubSystemC extends SubSystem {
    public processEntity = processEntity;

    public constructor() {
        super(Family.all(ComponentA, ComponentB).get());
    }
}

@Service()
class TestSystem extends SortedSubIteratingSystem {
    public constructor() {
        super(Family.all(ComponentX).get(), (a, b) => a.require(ComponentX).id - b.require(ComponentX).id);
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
        a.add(new ComponentX(10));
        a.add(new ComponentA());
        engine.entities.add(a);
        const b = new Entity();
        b.add(new ComponentB());
        b.add(new ComponentX(9));
        engine.entities.add(b);
        const c = new Entity();
        c.add(new ComponentX(8));
        c.add(new ComponentA());
        c.add(new ComponentB());
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
        a.add(new ComponentX(10));
        a.add(new ComponentA());
        engine.entities.add(a);
        const b = new Entity();
        b.add(new ComponentB());
        b.add(new ComponentX(9));
        engine.entities.add(b);
        const c = new Entity();
        c.add(new ComponentX(8));
        c.add(new ComponentA());
        c.add(new ComponentB());
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
