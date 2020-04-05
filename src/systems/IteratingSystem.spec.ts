import { Component } from "../core/Component";
import { Entity } from "../core/Entity";
import { Engine } from "../core/Engine";
import { Family } from "../core/Family";
import { IteratingSystem } from "./IteratingSystem";

const deltaTime = 0.16;

class ComponentA extends Component {}
class ComponentB extends Component {}
class ComponentC extends Component {}

class IteratingSystemMock extends IteratingSystem {
    public numUpdates = 0;

    protected processEntity(): void {
        ++this.numUpdates;
    }
}

class SpyComponent extends Component {
    updates = 0;
}

class IndexComponent extends Component {
    index = 0;

    constructor(index = 0) {
        super();
        this.index = index;
    }
}

class IteratingComponentRemovalSystem extends IteratingSystem {
    public constructor() {
        super(Family.all(SpyComponent, IndexComponent).get());
    }

    protected processEntity(entity: Entity): void {
        const indexComponent = entity.get(IndexComponent)!;
        const spyComponent = entity.get(SpyComponent)!;
        const { index } = indexComponent;
        if (index % 2 === 0) {
            entity.remove(SpyComponent);
            entity.remove(IndexComponent);
        } else {
            spyComponent.updates++;
        }
    }
}

class IteratingRemovalSystem extends IteratingSystem {
    public constructor(priority?: number) {
        super(Family.all(SpyComponent, IndexComponent).get(), priority);
    }

    protected addedToEngine(engine: Engine): void {
        super.addedToEngine(engine);
    }

    protected processEntity(entity: Entity): void {
        const indexComponent = entity.get(IndexComponent)!;
        const spyComponent = entity.get(SpyComponent)!;
        const { index } = indexComponent;
        if (index % 2 === 0) {
            const engine = this.getEngine();
            if (engine) engine.removeEntity(entity);
        } else {
            spyComponent.updates++;
        }
    }
}

describe("IteratingSystem", () => {
    test("priority", () => {
        let system = new IteratingRemovalSystem();
        expect(system.getPriority()).toBe(0);
        system = new IteratingRemovalSystem(10);
        expect(system.getPriority()).toBe(10);
        system.setPriority(13);
        expect(system.getPriority()).toBe(13);
    });

    test("sameEntitiesAndFamily", () => {
        const engine = new Engine();
        const family = Family.all(SpyComponent, IndexComponent).get();
        const entities = engine.getEntitiesFor(family);

        const system = engine.addSystem(new IteratingRemovalSystem());
        const systemEntities = system.getEntities();

        expect(entities).toHaveSameOrderedMembers(systemEntities);
        expect(system.getFamily()).toBe(family);
    });

    test("shouldIterateEntitiesWithCorrectFamily", () => {
        const engine = new Engine();

        const family = Family.all(ComponentA, ComponentB).get();
        const system = engine.addSystem(new IteratingSystemMock(family));
        const e = engine.createEntity();
        engine.addEntity(e);

        // When entity has ComponentA
        e.add(new ComponentA());
        engine.update(deltaTime);

        expect(system.numUpdates).toBe(0);

        // When entity has ComponentA and ComponentB
        system.numUpdates = 0;
        e.add(new ComponentB());
        engine.update(deltaTime);

        expect(system.numUpdates).toBe(1);

        // When entity has ComponentA, ComponentB and ComponentC
        system.numUpdates = 0;
        e.add(new ComponentC());
        engine.update(deltaTime);

        expect(system.numUpdates).toBe(1);

        // When entity has ComponentB and ComponentC
        system.numUpdates = 0;
        e.remove(ComponentA);
        engine.update(deltaTime);

        expect(system.numUpdates).toBe(0);
        engine.destroy();
    });

    test("entityRemovalWhileIterating", () => {
        const engine = new Engine();
        const entities = engine.getEntitiesFor(Family.all(SpyComponent, IndexComponent).get());

        engine.addSystem(new IteratingRemovalSystem());

        const numEntities = 10;

        for (let i = 0; i < numEntities; ++i) {
            const e = engine.createEntity();
            e.add(new SpyComponent());
            e.add(new IndexComponent(i + 1));

            engine.addEntity(e);
        }

        engine.update(deltaTime);

        expect(entities).toHaveLength(numEntities / 2);

        for (const e of entities) {
            const spyComponent = e.get(SpyComponent);
            expect(spyComponent).not.toBe(null);
            if (spyComponent) expect(spyComponent.updates).toBe(1);
        }
    });

    test("componentRemovalWhileIterating", () => {
        const engine = new Engine();
        const entities = engine.getEntitiesFor(Family.all(SpyComponent, IndexComponent).get());

        engine.addSystem(new IteratingComponentRemovalSystem());

        const numEntities = 10;

        for (let i = 0; i < numEntities; ++i) {
            const e = engine.createEntity();
            e.add(new SpyComponent());
            e.add(new IndexComponent(i + 1));

            engine.addEntity(e);
        }

        engine.update(deltaTime);

        expect(entities).toHaveLength(numEntities / 2);

        for (const e of entities) {
            const spyComponent = e.get(SpyComponent);
            expect(spyComponent).not.toBe(null);
            if (spyComponent) expect(spyComponent.updates).toBe(1);
        }
    });
});
