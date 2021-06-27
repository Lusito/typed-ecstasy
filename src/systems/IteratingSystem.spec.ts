import { Service } from "typedi";
import { Component, Entity, Engine, Family, IteratingSystem } from "typed-ecstasy";

const deltaTime = 0.16;

class ComponentA extends Component {}
class ComponentB extends Component {}
class ComponentC extends Component {}

@Service()
class IteratingSystemMock extends IteratingSystem {
    public numUpdates = 0;

    public constructor() {
        super(Family.all(ComponentA, ComponentB).get());
    }

    protected override processEntity(): void {
        ++this.numUpdates;
    }
}

class SpyComponent extends Component {
    public updates = 0;
}

class IndexComponent extends Component {
    public index = 0;

    public constructor(index = 0) {
        super();
        this.index = index;
    }
}

@Service()
class IteratingComponentRemovalSystem extends IteratingSystem {
    public constructor() {
        super(Family.all(SpyComponent, IndexComponent).get());
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
class IteratingRemovalSystem extends IteratingSystem {
    public constructor() {
        super(Family.all(SpyComponent, IndexComponent).get());
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

describe("IteratingSystem", () => {
    test("sameEntitiesAndFamily", () => {
        const engine = new Engine();
        const family = Family.all(SpyComponent, IndexComponent).get();
        const entities = engine.entities.forFamily(family);

        const system = engine.systems.add(IteratingRemovalSystem);
        const systemEntities = system.getEntities();

        expect(entities).toHaveSameOrderedMembers(systemEntities);
        expect(system.family).toBe(family);
    });

    test("shouldIterateEntitiesWithCorrectFamily", () => {
        const engine = new Engine();

        const system = engine.systems.add(IteratingSystemMock);
        const e = new Entity();
        engine.entities.add(e);

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
    });

    test("entityRemovalWhileIterating", () => {
        const engine = new Engine();
        const entities = engine.entities.forFamily(Family.all(SpyComponent, IndexComponent).get());

        engine.systems.add(IteratingRemovalSystem);

        const numEntities = 10;

        for (let i = 0; i < numEntities; ++i) {
            const e = new Entity();
            e.add(new SpyComponent());
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

    test("componentRemovalWhileIterating", () => {
        const engine = new Engine();
        const entities = engine.entities.forFamily(Family.all(SpyComponent, IndexComponent).get());

        engine.systems.add(IteratingComponentRemovalSystem);

        const numEntities = 10;

        for (let i = 0; i < numEntities; ++i) {
            const e = new Entity();
            e.add(new SpyComponent());
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
});
