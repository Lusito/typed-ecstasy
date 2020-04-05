import { Component } from "../core/Component";
import { Entity } from "../core/Entity";
import { Engine } from "../core/Engine";
import { Family } from "../core/Family";
import { SortedIteratingSystem } from "./SortedIteratingSystem";

const deltaTime = 0.16;

class ComponentB extends Component {}
class ComponentC extends Component {}

class OrderComponent extends Component {
    constructor(public name: string, public zLayer: number) {
        super();
    }
}

class SpyComponent extends Component {
    updates = 0;
}

class IndexComponent extends Component {
    constructor(public index: number) {
        super();
    }
}

function comparator(a: Entity, b: Entity): number {
    const ac = a.get(OrderComponent);
    const bc = b.get(OrderComponent);
    expect(ac).not.toBe(null);
    expect(bc).not.toBe(null);
    if (!ac || !bc) return 0;
    return ac.zLayer - bc.zLayer;
}

class SortedIteratingSystemMock extends SortedIteratingSystem {
    receivedNames: string[] = [];

    public constructor(family: Family) {
        super(family, comparator);
    }

    public processEntity(entity: Entity): void {
        const component = entity.get(OrderComponent)!;
        this.receivedNames.push(component.name);
    }
}

class IteratingComponentRemovalSystem extends SortedIteratingSystem {
    public constructor() {
        super(Family.all(SpyComponent, OrderComponent, IndexComponent).get(), comparator);
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

class IteratingRemovalSystem extends SortedIteratingSystem {
    public constructor(priority?: number) {
        super(Family.all(SpyComponent, IndexComponent).get(), comparator, priority);
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

describe("SortedIteratingSystem", () => {
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

        const numEntities = 10;

        for (let i = 0; i < numEntities; ++i) {
            const e = engine.createEntity();
            e.add(new SpyComponent());
            e.add(new OrderComponent("A", i));
            e.add(new IndexComponent(i + 1));

            engine.addEntity(e);
        }
        const e = engine.createEntity();
        e.add(new SpyComponent());

        engine.addEntity(e);

        expect(entities).toHaveSameOrderedMembers(systemEntities);
        expect(system.getFamily()).toBe(family);
    });

    test("addSystemAfterEntities", () => {
        const engine = new Engine();
        const family = Family.all(SpyComponent, IndexComponent).get();
        const entities = engine.getEntitiesFor(family);

        const numEntities = 10;

        for (let i = 0; i < numEntities; ++i) {
            const e = engine.createEntity();
            e.add(new SpyComponent());
            e.add(new OrderComponent("A", numEntities - i));
            e.add(new IndexComponent(i + 1));

            engine.addEntity(e);
        }
        const e = engine.createEntity();
        e.add(new SpyComponent());
        e.add(new OrderComponent("A", 0));

        engine.addEntity(e);

        const system = engine.addSystem(new IteratingRemovalSystem());
        const systemEntities = system.getEntities();
        expect(entities).toHaveSameMembers(systemEntities);
        expect(system.getFamily()).toBe(family);
    });

    test("shouldIterateSortedEntitiesWithCorrectFamily", () => {
        const engine = new Engine();

        const family = Family.all(OrderComponent, ComponentB).get();
        const system = engine.addSystem(new SortedIteratingSystemMock(family));
        const e = engine.createEntity();
        engine.addEntity(e);

        // When entity has OrderComponent
        e.add(new OrderComponent("A", 0));
        engine.update(deltaTime);
        expect(system.receivedNames).toHaveLength(0);

        // When entity has OrderComponent and ComponentB
        e.add(new ComponentB());
        engine.update(deltaTime);
        expect(system.receivedNames).toHaveSameOrderedMembers(["A"]);
        system.receivedNames.length = 0;

        // When entity has OrderComponent, ComponentB and ComponentC
        e.add(new ComponentC());
        engine.update(deltaTime);
        expect(system.receivedNames).toHaveSameOrderedMembers(["A"]);
        system.receivedNames.length = 0;

        // When entity has ComponentB and ComponentC
        e.remove(OrderComponent);
        engine.update(deltaTime);
        expect(system.receivedNames).toHaveLength(0);
        engine.destroy();
    });

    test("entityRemovalWhileSortedIterating", () => {
        const engine = new Engine();
        const entities = engine.getEntitiesFor(Family.all(SpyComponent, IndexComponent).get());

        engine.addSystem(new IteratingRemovalSystem());

        const numEntities = 10;

        for (let i = 0; i < numEntities; ++i) {
            const e = engine.createEntity();
            e.add(new SpyComponent());
            e.add(new OrderComponent(i.toString(), i));
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

    test("componentRemovalWhileSortedIterating", () => {
        const engine = new Engine();
        const entities = engine.getEntitiesFor(Family.all(SpyComponent, IndexComponent).get());

        engine.addSystem(new IteratingComponentRemovalSystem());

        const numEntities = 10;

        for (let i = 0; i < numEntities; ++i) {
            const e = engine.createEntity();
            e.add(new SpyComponent());
            e.add(new OrderComponent(i.toString(), i));
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

    function createOrderEntity(name: string, zLayer: number, engine: Engine): Entity {
        const e = engine.createEntity();
        e.add(new OrderComponent(name, zLayer));
        return e;
    }

    test("entityOrder", () => {
        const engine = new Engine();

        const family = Family.all(OrderComponent).get();
        const system = engine.addSystem(new SortedIteratingSystemMock(family));

        const a = createOrderEntity("A", 0, engine);
        const b = createOrderEntity("B", 1, engine);
        const c = createOrderEntity("C", 3, engine);
        const d = createOrderEntity("D", 2, engine);

        engine.addEntity(a);
        engine.addEntity(b);
        engine.addEntity(c);
        engine.update(0);
        expect(system.receivedNames).toHaveSameOrderedMembers(["A", "B", "C"]);
        system.receivedNames.length = 0;

        engine.addEntity(d);
        engine.update(0);
        expect(system.receivedNames).toHaveSameOrderedMembers(["A", "B", "D", "C"]);
        system.receivedNames.length = 0;

        const ac = a.get(OrderComponent);
        const bc = b.get(OrderComponent);
        const cc = c.get(OrderComponent);
        const dc = d.get(OrderComponent);
        expect(ac).not.toBe(null);
        expect(bc).not.toBe(null);
        expect(cc).not.toBe(null);
        expect(dc).not.toBe(null);
        if (ac) ac.zLayer = 3;
        if (bc) bc.zLayer = 2;
        if (cc) cc.zLayer = 1;
        if (dc) dc.zLayer = 0;
        system.forceSort();
        engine.update(0);
        expect(system.receivedNames).toHaveSameOrderedMembers(["D", "C", "B", "A"]);
    });

    test("unknownEntityRemoved", () => {
        const engine = new Engine();

        const family = Family.all(OrderComponent).get();
        const system = engine.addSystem(new SortedIteratingSystemMock(family));

        const e = engine.createEntity();
        engine.getEntityRemovedSignal(family).emit(e);
        expect(system.receivedNames).toHaveLength(0);
    });
});
