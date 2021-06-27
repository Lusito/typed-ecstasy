import { Service } from "typedi";
import { Component, Entity, Engine, Family, IntervalIteratingSystem } from "typed-ecstasy";

const deltaTime = 0.1;

class IntervalComponentSpy extends Component {
    public numUpdates = 0;
}

@Service()
class IntervalIteratingSystemSpy extends IntervalIteratingSystem {
    public constructor() {
        super(Family.all(IntervalComponentSpy).get(), deltaTime * 2.0);
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
        const systemEntities = system.getEntities();

        expect(entities).toHaveSameOrderedMembers(systemEntities);
        expect(system.family).toBe(family);
    });

    test("intervalIteratingSystem", () => {
        const engine = new Engine();
        const entities = engine.entities.forFamily(Family.all(IntervalComponentSpy).get());

        engine.systems.add(IntervalIteratingSystemSpy);

        for (let i = 0; i < 10; ++i) {
            const entity = new Entity();
            entity.add(new IntervalComponentSpy());
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
