import { Entity, Engine, Family, IntervalIteratingSystem, service, Component, registerComponent } from "typed-ecstasy";

const deltaTime = 0.1;

class IntervalComponentSpy extends Component {
    public static readonly key = "Interval";
    public numUpdates!: number;
}
registerComponent(IntervalComponentSpy, {
    reset(comp) {
        comp.numUpdates = 0;
    },
});

@service()
class IntervalIteratingSystemSpy extends IntervalIteratingSystem {
    public constructor(engine: Engine) {
        super(engine, Family.all(IntervalComponentSpy).get(), deltaTime * 2.0);
    }

    protected override processEntity(entity: Entity): void {
        const component = entity.require(IntervalComponentSpy);
        component.numUpdates++;
    }
}

describe("IntervalIteratingSystem", () => {
    test("sameEntitiesAndFamily", () => {
        const engine = new Engine();
        const family = Family.all(IntervalComponentSpy).get();
        const entities = engine.entities.forFamily(family);

        const system = engine.systems.add(IntervalIteratingSystemSpy);

        expect(entities).toHaveSameOrderedMembers(system.entities);
        expect(system.family).toBe(family);
    });

    test("intervalIteratingSystem", () => {
        const engine = new Engine();
        const entities = engine.entities.forFamily(Family.all(IntervalComponentSpy).get());

        engine.systems.add(IntervalIteratingSystemSpy);

        for (let i = 0; i < 10; ++i) {
            const entity = new Entity();
            entity.add(engine.obtainComponent(IntervalComponentSpy)!);
            engine.entities.add(entity);
        }

        for (let i = 1; i <= 10; ++i) {
            engine.update(deltaTime);

            for (const e of entities) {
                const component = e.require(IntervalComponentSpy);
                expect(component.numUpdates).toBe(Math.floor(i / 2));
            }
        }
    });

    test("testGetInterval", () => {
        const engine = new Engine();
        const system = engine.systems.add(IntervalIteratingSystemSpy);
        expect(system.getInterval()).toBe(deltaTime * 2.0);
    });
});
