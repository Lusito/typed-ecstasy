import { Entity, Engine, Family, IteratingSystem, service, Component, registerComponent } from "typed-ecstasy";

const deltaTime = 0.16;

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

@service()
class IteratingSystemMock extends IteratingSystem {
    public numUpdates = 0;

    public constructor(engine: Engine) {
        super(engine, Family.all(ComponentA, ComponentB).get());
    }

    protected override processEntity(): void {
        ++this.numUpdates;
    }
}

class SpyComponent extends Component {
    public static readonly key = "Spy";
    public updates!: number;
}
registerComponent(SpyComponent, {
    reset(comp) {
        comp.updates = 0;
    },
});

class IndexComponent extends Component {
    public static readonly key = "Index";
    public index!: number;
}
registerComponent(IndexComponent, {
    reset(comp) {
        comp.index = 0;
    },
});

@service()
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

@service()
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

        expect(entities).toHaveSameOrderedMembers(system.entities);
        expect(system.family).toBe(family);
    });

    test("shouldIterateEntitiesWithCorrectFamily", () => {
        const engine = new Engine();

        const system = engine.systems.add(IteratingSystemMock);
        const e = new Entity();
        engine.entities.add(e);

        // When entity has ComponentA
        e.add(engine.obtainComponent(ComponentA)!);
        engine.update(deltaTime);

        expect(system.numUpdates).toBe(0);

        // When entity has ComponentA and ComponentB
        system.numUpdates = 0;
        e.add(engine.obtainComponent(ComponentB)!);
        engine.update(deltaTime);

        expect(system.numUpdates).toBe(1);

        // When entity has ComponentA, ComponentB and ComponentC
        system.numUpdates = 0;
        e.add(engine.obtainComponent(ComponentC)!);
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
            e.add(engine.obtainComponent(SpyComponent)!);
            e.add(engine.obtainComponent(IndexComponent)!).index = i + 1;

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
            e.add(engine.obtainComponent(SpyComponent)!);
            e.add(engine.obtainComponent(IndexComponent)!).index = i + 1;

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
