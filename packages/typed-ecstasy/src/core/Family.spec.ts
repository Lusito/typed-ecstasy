import { Engine, Family, IteratingSystem, Entity, service, Component, registerComponent } from "typed-ecstasy";

class ComponentA extends Component {
    public static readonly key = "A";
}
registerComponent(ComponentA, {});

class ComponentB extends Component {
    public static readonly key = "B";
}
registerComponent(ComponentB, {});

class ComponentC extends Component {
    public static readonly key = "C";
}
registerComponent(ComponentC, {});

class ComponentD extends Component {
    public static readonly key = "D";
}
registerComponent(ComponentD, {});

class ComponentE extends Component {
    public static readonly key = "E";
}
registerComponent(ComponentE, {});

class ComponentF extends Component {
    public static readonly key = "F";
}
registerComponent(ComponentF, {});

@service()
class TestSystemA extends IteratingSystem {
    public constructor(engine: Engine) {
        super(engine, Family.all(ComponentA).get());
    }

    protected override processEntity(): void {}
}

describe("Family", () => {
    test("staticBuilders", () => {
        const a = Family.all(ComponentA, ComponentB).one(ComponentC, ComponentD).exclude(ComponentE, ComponentE).get();
        const b = Family.one(ComponentC, ComponentD).all(ComponentA, ComponentB).exclude(ComponentE, ComponentE).get();
        const c = Family.exclude(ComponentE, ComponentE).all(ComponentA, ComponentB).one(ComponentC, ComponentD).get();
        expect(a).toBe(b);
        expect(a).toBe(c);
    });

    test("sameFamily", () => {
        const family1 = Family.all(ComponentA).get();
        const family2 = Family.all(ComponentA).get();
        const family3 = Family.all(ComponentA, ComponentB).get();
        const family4 = Family.all(ComponentA, ComponentB).get();
        const family5 = Family.all(ComponentA, ComponentB, ComponentC).get();
        const family6 = Family.all(ComponentA, ComponentB, ComponentC).get();
        const family7 = Family.all(ComponentA, ComponentB)
            .one(ComponentC, ComponentD)
            .exclude(ComponentE, ComponentF)
            .get();
        const family8 = Family.all(ComponentA, ComponentB)
            .one(ComponentC, ComponentD)
            .exclude(ComponentE, ComponentF)
            .get();
        const family9 = Family.all().get();
        const family10 = Family.all().get();

        expect(family1).toBe(family2);
        expect(family2).toBe(family1);
        expect(family3).toBe(family4);
        expect(family4).toBe(family3);
        expect(family5).toBe(family6);
        expect(family6).toBe(family5);
        expect(family7).toBe(family8);
        expect(family8).toBe(family7);
        expect(family9).toBe(family10);

        expect(family1.index).toBe(family2.index);
        expect(family3.index).toBe(family4.index);
        expect(family5.index).toBe(family6.index);
        expect(family7.index).toBe(family8.index);
        expect(family9.index).toBe(family10.index);
    });

    test("differentFamily", () => {
        const family1 = Family.all(ComponentA).get();
        const family2 = Family.all(ComponentB).get();
        const family3 = Family.all(ComponentC).get();
        const family4 = Family.all(ComponentA, ComponentB).get();
        const family5 = Family.all(ComponentA, ComponentC).get();
        const family6 = Family.all(ComponentB, ComponentA).get();
        const family7 = Family.all(ComponentB, ComponentC).get();
        const family8 = Family.all(ComponentC, ComponentA).get();
        const family9 = Family.all(ComponentC, ComponentB).get();
        const family10 = Family.all(ComponentA, ComponentB, ComponentC).get();
        const family11 = Family.all(ComponentA, ComponentB)
            .one(ComponentC, ComponentD)
            .exclude(ComponentE, ComponentF)
            .get();
        const family12 = Family.all(ComponentC, ComponentD)
            .one(ComponentE, ComponentF)
            .exclude(ComponentA, ComponentB)
            .get();
        const family13 = Family.all().get();

        expect(family1).not.toBe(family2);
        expect(family1).not.toBe(family3);
        expect(family1).not.toBe(family4);
        expect(family1).not.toBe(family5);
        expect(family1).not.toBe(family6);
        expect(family1).not.toBe(family7);
        expect(family1).not.toBe(family8);
        expect(family1).not.toBe(family9);
        expect(family1).not.toBe(family10);
        expect(family1).not.toBe(family11);
        expect(family1).not.toBe(family12);
        expect(family1).not.toBe(family13);

        expect(family10).not.toBe(family1);
        expect(family10).not.toBe(family2);
        expect(family10).not.toBe(family3);
        expect(family10).not.toBe(family4);
        expect(family10).not.toBe(family5);
        expect(family10).not.toBe(family6);
        expect(family10).not.toBe(family7);
        expect(family10).not.toBe(family8);
        expect(family10).not.toBe(family9);
        expect(family11).not.toBe(family12);
        expect(family10).not.toBe(family13);

        expect(family1.index).not.toBe(family2.index);
        expect(family1.index).not.toBe(family3.index);
        expect(family1.index).not.toBe(family4.index);
        expect(family1.index).not.toBe(family5.index);
        expect(family1.index).not.toBe(family6.index);
        expect(family1.index).not.toBe(family7.index);
        expect(family1.index).not.toBe(family8.index);
        expect(family1.index).not.toBe(family9.index);
        expect(family1.index).not.toBe(family10.index);
        expect(family11.index).not.toBe(family12.index);
        expect(family1.index).not.toBe(family13.index);
    });

    test("familyEqualityFiltering", () => {
        const family1 = Family.all(ComponentA).one(ComponentB).exclude(ComponentC).get();
        const family2 = Family.all(ComponentB).one(ComponentC).exclude(ComponentA).get();
        const family3 = Family.all(ComponentC).one(ComponentA).exclude(ComponentB).get();
        const family4 = Family.all(ComponentA).one(ComponentB).exclude(ComponentC).get();
        const family5 = Family.all(ComponentB).one(ComponentC).exclude(ComponentA).get();
        const family6 = Family.all(ComponentC).one(ComponentA).exclude(ComponentB).get();

        expect(family1).toBe(family4);
        expect(family2).toBe(family5);
        expect(family3).toBe(family6);
        expect(family1).not.toBe(family2);
        expect(family1).not.toBe(family3);
    });

    test("entityMatch", () => {
        const family = Family.all(ComponentA, ComponentB).get();

        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);
        entity.add(engine.obtainComponent(ComponentA)!);
        entity.add(engine.obtainComponent(ComponentB)!);

        expect(family.matches(entity)).toBe(true);

        entity.add(engine.obtainComponent(ComponentC)!);

        expect(family.matches(entity)).toBe(true);
    });

    test("entityMismatch", () => {
        const family = Family.all(ComponentA, ComponentC).get();

        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);
        entity.add(engine.obtainComponent(ComponentA)!);
        entity.add(engine.obtainComponent(ComponentB)!);

        expect(family.matches(entity)).toBe(false);

        entity.remove(ComponentB);

        expect(family.matches(entity)).toBe(false);
    });

    test("entityMatchThenMismatch", () => {
        const family = Family.all(ComponentA, ComponentB).get();

        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);
        entity.add(engine.obtainComponent(ComponentA)!);
        entity.add(engine.obtainComponent(ComponentB)!);

        expect(family.matches(entity)).toBe(true);

        entity.remove(ComponentA);

        expect(family.matches(entity)).toBe(false);
    });

    test("entityMismatchThenMatch", () => {
        const family = Family.all(ComponentA, ComponentB).get();

        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);
        entity.add(engine.obtainComponent(ComponentA)!);
        entity.add(engine.obtainComponent(ComponentC)!);

        expect(family.matches(entity)).toBe(false);

        entity.add(engine.obtainComponent(ComponentB)!);

        expect(family.matches(entity)).toBe(true);
    });

    test("testEmptyFamily", () => {
        const family = Family.all().get();
        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);
        expect(family.matches(entity)).toBe(true);
    });

    test("familyFiltering", () => {
        const family1 = Family.all(ComponentA, ComponentB)
            .one(ComponentC, ComponentD)
            .exclude(ComponentE, ComponentF)
            .get();

        const family2 = Family.all(ComponentC, ComponentD)
            .one(ComponentA, ComponentB)
            .exclude(ComponentE, ComponentF)
            .get();

        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);

        expect(family1.matches(entity)).toBe(false);
        expect(family2.matches(entity)).toBe(false);

        entity.add(engine.obtainComponent(ComponentA)!);
        entity.add(engine.obtainComponent(ComponentB)!);

        expect(family1.matches(entity)).toBe(false);
        expect(family2.matches(entity)).toBe(false);

        entity.add(engine.obtainComponent(ComponentC)!);

        expect(family1.matches(entity)).toBe(true);
        expect(family2.matches(entity)).toBe(false);

        entity.add(engine.obtainComponent(ComponentD)!);

        expect(family1.matches(entity)).toBe(true);
        expect(family2.matches(entity)).toBe(true);

        entity.add(engine.obtainComponent(ComponentE)!);

        expect(family1.matches(entity)).toBe(false);
        expect(family2.matches(entity)).toBe(false);

        entity.remove(ComponentE);

        expect(family1.matches(entity)).toBe(true);
        expect(family2.matches(entity)).toBe(true);

        entity.remove(ComponentA);

        expect(family1.matches(entity)).toBe(false);
        expect(family2.matches(entity)).toBe(true);
    });

    test("matchWithEngine", () => {
        const engine = new Engine();
        engine.systems.add(TestSystemA);

        const e = new Entity();
        e.add(engine.obtainComponent(ComponentB)!);
        e.add(engine.obtainComponent(ComponentA)!);
        engine.entities.add(e);

        const f = Family.all(ComponentB).exclude(ComponentA).get();

        expect(f.matches(e)).toBe(false);
    });

    test("matchWithEngineInverse", () => {
        const engine = new Engine();

        engine.systems.add(TestSystemA);

        const e = new Entity();
        e.add(engine.obtainComponent(ComponentB)!);
        e.add(engine.obtainComponent(ComponentA)!);
        engine.entities.add(e);

        const f = Family.all(ComponentA).exclude(ComponentB).get();

        expect(f.matches(e)).toBe(false);
    });

    test("matchWithoutSystems", () => {
        const engine = new Engine();

        const e = new Entity();
        e.add(engine.obtainComponent(ComponentB)!);
        e.add(engine.obtainComponent(ComponentA)!);
        engine.entities.add(e);

        const f = Family.all(ComponentB).exclude(ComponentA).get();

        expect(f.matches(e)).toBe(false);
    });

    test("matchWithComplexBuilding", () => {
        const family = Family.all(ComponentB).one(ComponentA).exclude(ComponentC).get();
        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);
        entity.add(engine.obtainComponent(ComponentA)!);
        expect(family.matches(entity)).toBe(false);
        entity.add(engine.obtainComponent(ComponentB)!);
        expect(family.matches(entity)).toBe(true);
        entity.add(engine.obtainComponent(ComponentC)!);
        expect(family.matches(entity)).toBe(false);
    });
});
