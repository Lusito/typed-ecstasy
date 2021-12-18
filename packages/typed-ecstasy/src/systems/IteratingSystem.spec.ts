import {
    Entity,
    Engine,
    Family,
    IteratingSystem,
    service,
    declareMarkerComponent,
    declareComponent,
} from "typed-ecstasy";

const deltaTime = 0.16;

const ComponentA = declareMarkerComponent("A");
const ComponentB = declareMarkerComponent("B");
const ComponentC = declareMarkerComponent("C");

@service("IteratingSystemMock")
class IteratingSystemMock extends IteratingSystem {
    public numUpdates = 0;

    public constructor(engine: Engine) {
        super(engine, Family.all(ComponentA, ComponentB).get());
    }

    protected override processEntity(): void {
        ++this.numUpdates;
    }
}

interface SpyComponentData {
    updates: number;
}

const SpyComponent = declareComponent("SpyComponent").withoutConfig<SpyComponentData>({
    reset(comp) {
        comp.updates = 0;
    },
});

interface IndexComponentData {
    index: number;
}

const IndexComponent = declareComponent("IndexComponent").withoutConfig<IndexComponentData>({
    reset(comp) {
        comp.index = 0;
    },
});

@service("IteratingComponentRemovalSystem")
class IteratingComponentRemovalSystem extends IteratingSystem {
    public constructor(engine: Engine) {
        super(engine, Family.all(SpyComponent, IndexComponent).get());
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

@service("IteratingRemovalSystem")
class IteratingRemovalSystem extends IteratingSystem {
    public constructor(engine: Engine) {
        super(engine, Family.all(SpyComponent, IndexComponent).get());
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
        e.add(engine.createComponent(ComponentA)!);
        engine.update(deltaTime);

        expect(system.numUpdates).toBe(0);

        // When entity has ComponentA and ComponentB
        system.numUpdates = 0;
        e.add(engine.createComponent(ComponentB)!);
        engine.update(deltaTime);

        expect(system.numUpdates).toBe(1);

        // When entity has ComponentA, ComponentB and ComponentC
        system.numUpdates = 0;
        e.add(engine.createComponent(ComponentC)!);
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
            e.add(engine.createComponent(SpyComponent)!);
            e.add(engine.createComponent(IndexComponent)!).index = i + 1;

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
            e.add(engine.createComponent(SpyComponent)!);
            e.add(engine.createComponent(IndexComponent)!).index = i + 1;

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
