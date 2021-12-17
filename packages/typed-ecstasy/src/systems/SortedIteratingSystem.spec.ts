import { Service } from "typedi";
import { Component, Entity, Engine, Family, SortedIteratingSystem } from "typed-ecstasy";

const deltaTime = 0.16;

class ComponentB extends Component {}
class ComponentC extends Component {}

class OrderComponent extends Component {
    public constructor(public name: string, public zLayer: number) {
        super();
    }
}

class SpyComponent extends Component {
    public updates = 0;
}

class IndexComponent extends Component {
    public constructor(public index: number) {
        super();
    }
}

function comparator(a: Entity, b: Entity): number {
    const ac = a.require(OrderComponent);
    const bc = b.require(OrderComponent);
    return ac.zLayer - bc.zLayer;
}

@Service()
class SortedIteratingSystemMock extends SortedIteratingSystem {
    public receivedNames: string[] = [];

    public constructor(family: Family) {
        super(family, comparator);
    }

    public processEntity(entity: Entity): void {
        const component = entity.require(OrderComponent);
        this.receivedNames.push(component.name);
    }
}

@Service()
class SortedIteratingSystemMockA extends SortedIteratingSystemMock {
    public constructor() {
        super(Family.all(OrderComponent).get());
    }
}

@Service()
class SortedIteratingSystemMockB extends SortedIteratingSystemMock {
    public constructor() {
        super(Family.all(OrderComponent, ComponentB).get());
    }
}

@Service()
class IteratingComponentRemovalSystem extends SortedIteratingSystem {
    public constructor() {
        super(Family.all(SpyComponent, OrderComponent, IndexComponent).get(), comparator);
    }

    protected override processEntity(entity: Entity): void {
        const indexComponent = entity.require(IndexComponent);
        const spyComponent = entity.require(SpyComponent);
        const { index } = indexComponent;
        if (index % 2 === 0) {
            entity.remove(SpyComponent);
            entity.remove(IndexComponent);
        } else {
            spyComponent.updates++;
        }
    }
}

@Service()
class IteratingRemovalSystem extends SortedIteratingSystem {
    public constructor() {
        super(Family.all(SpyComponent, IndexComponent).get(), comparator);
    }

    protected override processEntity(entity: Entity): void {
        const indexComponent = entity.require(IndexComponent);
        const spyComponent = entity.require(SpyComponent);
        const { index } = indexComponent;
        if (index % 2 === 0) {
            this.engine.entities.remove(entity);
        } else {
            spyComponent.updates++;
        }
    }
}

describe("SortedIteratingSystem", () => {
    test("sameEntitiesAndFamily", () => {
        const engine = new Engine();
        const family = Family.all(SpyComponent, IndexComponent).get();
        const entities = engine.entities.forFamily(family);

        const system = engine.systems.add(IteratingRemovalSystem);
        const systemEntities = system.getEntities();

        const numEntities = 10;

        for (let i = 0; i < numEntities; ++i) {
            const e = new Entity();
            e.add(new SpyComponent());
            e.add(new OrderComponent("A", i));
            e.add(new IndexComponent(i + 1));

            engine.entities.add(e);
        }
        const e = new Entity();
        e.add(new SpyComponent());

        engine.entities.add(e);

        expect(entities).toHaveSameOrderedMembers(systemEntities);
        expect(system.family).toBe(family);
    });

    test("addSystemAfterEntities", () => {
        const engine = new Engine();
        const family = Family.all(SpyComponent, IndexComponent).get();
        const entities = engine.entities.forFamily(family);

        const numEntities = 10;

        for (let i = 0; i < numEntities; ++i) {
            const e = new Entity();
            e.add(new SpyComponent());
            e.add(new OrderComponent("A", numEntities - i));
            e.add(new IndexComponent(i + 1));

            engine.entities.add(e);
        }
        const e = new Entity();
        e.add(new SpyComponent());
        e.add(new OrderComponent("A", 0));

        engine.entities.add(e);

        const system = engine.systems.add(IteratingRemovalSystem);
        const systemEntities = system.getEntities();
        expect(entities).toHaveSameMembers(systemEntities);
        expect(system.family).toBe(family);
    });

    test("shouldIterateSortedEntitiesWithCorrectFamily", () => {
        const engine = new Engine();

        const system = engine.systems.add(SortedIteratingSystemMockB);
        const e = new Entity();
        engine.entities.add(e);

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
    });

    test("entityRemovalWhileSortedIterating", () => {
        const engine = new Engine();
        const entities = engine.entities.forFamily(Family.all(SpyComponent, IndexComponent).get());

        engine.systems.add(IteratingRemovalSystem);

        const numEntities = 10;

        for (let i = 0; i < numEntities; ++i) {
            const e = new Entity();
            e.add(new SpyComponent());
            e.add(new OrderComponent(i.toString(), i));
            e.add(new IndexComponent(i + 1));

            engine.entities.add(e);
        }

        engine.update(deltaTime);

        expect(entities).toHaveLength(numEntities / 2);

        for (const e of entities) {
            const spyComponent = e.require(SpyComponent);
            expect(spyComponent.updates).toBe(1);
        }
    });

    test("componentRemovalWhileSortedIterating", () => {
        const engine = new Engine();
        const entities = engine.entities.forFamily(Family.all(SpyComponent, IndexComponent).get());

        engine.systems.add(IteratingComponentRemovalSystem);

        const numEntities = 10;

        for (let i = 0; i < numEntities; ++i) {
            const e = new Entity();
            e.add(new SpyComponent());
            e.add(new OrderComponent(i.toString(), i));
            e.add(new IndexComponent(i + 1));

            engine.entities.add(e);
        }

        engine.update(deltaTime);

        expect(entities).toHaveLength(numEntities / 2);

        for (const e of entities) {
            const spyComponent = e.require(SpyComponent);
            expect(spyComponent.updates).toBe(1);
        }
    });

    function createOrderEntity(name: string, zLayer: number): Entity {
        const e = new Entity();
        e.add(new OrderComponent(name, zLayer));
        return e;
    }

    test("entityOrder", () => {
        const engine = new Engine();

        const system = engine.systems.add(SortedIteratingSystemMockA);

        const a = createOrderEntity("A", 0);
        const b = createOrderEntity("B", 1);
        const c = createOrderEntity("C", 3);
        const d = createOrderEntity("D", 2);

        engine.entities.add(a);
        engine.entities.add(b);
        engine.entities.add(c);
        engine.update(0);
        expect(system.receivedNames).toHaveSameOrderedMembers(["A", "B", "C"]);
        system.receivedNames.length = 0;

        engine.entities.add(d);
        engine.update(0);
        expect(system.receivedNames).toHaveSameOrderedMembers(["A", "B", "D", "C"]);
        system.receivedNames.length = 0;

        a.require(OrderComponent).zLayer = 3;
        b.require(OrderComponent).zLayer = 2;
        c.require(OrderComponent).zLayer = 1;
        d.require(OrderComponent).zLayer = 0;
        system.forceSort();
        engine.update(0);
        expect(system.receivedNames).toHaveSameOrderedMembers(["D", "C", "B", "A"]);
    });

    test("unknownEntityRemoved", () => {
        const engine = new Engine();

        const system = engine.systems.add(SortedIteratingSystemMockA);

        const e = new Entity();
        engine.entities.onRemoveForFamily(system.family).emit(e);
        expect(system.receivedNames).toHaveLength(0);
    });
});
