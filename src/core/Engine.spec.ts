/* eslint-disable dot-notation */
import { Service } from "typedi";
import { Component, Entity, Engine, Family, EntitySystem } from "typed-ecstasy";

const deltaTime = 0.16;
class ComponentA extends Component {}

abstract class EntitySystemMockBase extends EntitySystem {
    public updates: number[] | null = [];

    public id = 0;

    public updateSpy: jest.SpyInstance;

    public constructor() {
        super();
        this.onEnable = jest.fn();
        this.onDisable = jest.fn();
        this.updateSpy = jest.spyOn(this as any, "update");
    }

    public override update(): void {
        if (this.updates != null) this.updates.push(this.id);
    }
}

@Service()
class EntitySystemMock extends EntitySystemMockBase {}

@Service()
class EntitySystemMockA extends EntitySystemMockBase {}

@Service()
class EntitySystemMockB extends EntitySystemMockBase {}

class CounterComponent extends Component {
    public counter = 0;
}

@Service()
class CounterSystem extends EntitySystem {
    public entities: Entity[] | null = null;

    public onEntityRemove: (e: Entity) => void = (() => {}) as any;

    protected override onEnable(): void {
        this.entities = this.engine.entities.forFamily(Family.all(CounterComponent).get());
    }

    public override update() {
        const { engine } = this;
        const entities = this.entities!;
        for (let i = 0; i < entities.length; ++i) {
            const e = entities[i];
            if (i % 2 === 0) {
                const cc = e.require(CounterComponent);
                cc.counter++;
            } else {
                engine.entities.remove(e);
                this.onEntityRemove(e);
            }
        }
    }
}

@Service()
class UpdateSystem<T extends (engine: Engine) => any> extends EntitySystem {
    public result: ReturnType<T> | null = null;

    public callback: T = (() => 0) as any as T;

    public override update() {
        this.result = this.callback(this.engine);
    }
}

describe("Engine", () => {
    test("#isUpdating()", () => {
        const engine = new Engine();
        const system = engine.systems.add(UpdateSystem);
        system.callback = (e) => e.isUpdating();
        engine.update(deltaTime);
        expect(system.result).toBe(true);
    });

    test("systemUpdate", () => {
        const engine = new Engine();

        const systemA = engine.systems.add(EntitySystemMockA);
        const systemB = engine.systems.add(EntitySystemMockB);

        const numUpdates = 10;

        for (let i = 0; i < numUpdates; ++i) {
            engine.update(deltaTime);

            expect(systemA.updateSpy).toHaveBeenCalledTimes(i + 1);
            expect(systemB.updateSpy).toHaveBeenCalledTimes(i + 1);
        }

        engine.systems.remove(EntitySystemMockB);

        for (let i = 0; i < numUpdates; ++i) {
            expect(systemA.updateSpy).toHaveBeenCalledTimes(i + numUpdates);
            expect(systemB.updateSpy).toHaveBeenCalledTimes(numUpdates);

            engine.update(deltaTime);

            expect(systemA.updateSpy).toHaveBeenCalledTimes(i + 1 + numUpdates);
            expect(systemB.updateSpy).toHaveBeenCalledTimes(numUpdates);
        }
    });

    test("systemUpdateOrder", () => {
        const updates: number[] = [];

        const engine = new Engine();

        const systemA = engine.systems.add(EntitySystemMockA, 2);
        systemA.id = 2;
        systemA.updates = updates;
        const systemB = engine.systems.add(EntitySystemMockB, 1);
        systemB.id = 1;
        systemB.updates = updates;

        engine.update(deltaTime);

        let previous = Number.MIN_VALUE;

        for (const value of updates) {
            expect(value).toBeGreaterThanOrEqual(previous);

            previous = value;
        }
    });

    test("ignoreSystem", () => {
        const engine = new Engine();

        const system = engine.systems.add(EntitySystemMock);

        const numUpdates = 10;

        for (let i = 0; i < numUpdates; ++i) {
            system.setEnabled(i % 2 === 0);
            engine.update(deltaTime);
            expect(system.updateSpy).toHaveBeenCalledTimes(Math.floor(i / 2) + 1);
        }
    });

    test("entitySystemRemovalWhileIterating", () => {
        const engine = new Engine();

        const system = engine.systems.add(CounterSystem);
        system.onEntityRemove = (e) => expect(e.isScheduledForRemoval()).toBe(true);

        for (let i = 0; i < 20; ++i) {
            const entity = new Entity();
            entity.add(new CounterComponent());
            engine.entities.add(entity);
        }

        const entities = engine.entities.forFamily(Family.all(CounterComponent).get());

        for (const e of entities) {
            const cc = e.require(CounterComponent);
            expect(cc.counter).toBe(0);
        }

        engine.update(deltaTime);

        for (const e of entities) {
            const cc = e.require(CounterComponent);
            expect(cc.counter).toBe(1);
        }
    });

    test("createManyEntitiesNoStackOverflow", () => {
        const engine = new Engine();
        const system = engine.systems.add(CounterSystem);
        system.onEntityRemove = (e) => expect(e.isScheduledForRemoval()).toBe(true);

        for (let i = 0; i < 15000; i++) {
            const e = new Entity();
            e.add(new ComponentA());
            engine.entities.add(e);
        }

        engine.update(0);
    });
});
