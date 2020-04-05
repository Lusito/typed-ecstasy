import { Component } from "../core/Component";
import { Entity } from "../core/Entity";
import { Engine } from "../core/Engine";
import { Family } from "../core/Family";
import { IntervalIteratingSystem } from "./IntervalIteratingSystem";

const deltaTime = 0.1;

class IntervalComponentSpy extends Component {
    numUpdates = 0;
}

class IntervalIteratingSystemSpy extends IntervalIteratingSystem {
    public constructor(priority?: number) {
        super(Family.all(IntervalComponentSpy).get(), deltaTime * 2.0, priority);
    }

    protected processEntity(entity: Entity): void {
        const component = entity.get(IntervalComponentSpy)!;
        component.numUpdates++;
    }
}

describe("IntervalIteratingSystem", () => {
    test("priority", () => {
        let system = new IntervalIteratingSystemSpy();
        expect(system.getPriority()).toBe(0);
        system = new IntervalIteratingSystemSpy(10);
        expect(system.getPriority()).toBe(10);
        system.setPriority(13);
        expect(system.getPriority()).toBe(13);
    });

    test("sameEntitiesAndFamily", () => {
        const engine = new Engine();
        const family = Family.all(IntervalComponentSpy).get();
        const entities = engine.getEntitiesFor(family);

        const system = engine.addSystem(new IntervalIteratingSystemSpy());
        const systemEntities = system.getEntities();

        expect(entities).toHaveSameOrderedMembers(systemEntities);
        expect(system.getFamily()).toBe(family);
    });

    test("intervalIteratingSystem", () => {
        const engine = new Engine();
        const entities = engine.getEntitiesFor(Family.all(IntervalComponentSpy).get());

        engine.addSystem(new IntervalIteratingSystemSpy());

        for (let i = 0; i < 10; ++i) {
            const entity = engine.createEntity();
            entity.add(new IntervalComponentSpy());
            engine.addEntity(entity);
        }

        for (let i = 1; i <= 10; ++i) {
            engine.update(deltaTime);

            for (const e of entities) {
                const component = e.get(IntervalComponentSpy);
                expect(component).not.toBe(null);
                if (component) expect(component.numUpdates).toBe(Math.floor(i / 2));
            }
        }
        engine.destroy();
    });

    test("testGetInterval", () => {
        const system = new IntervalIteratingSystemSpy();
        expect(system.getInterval()).toBe(deltaTime * 2.0);
    });
});
