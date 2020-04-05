import { Component } from "./Component";
import { Entity } from "./Entity";
import { Engine } from "./Engine";
import { Family } from "./Family";
import { EntitySystem } from "./EntitySystem";

const deltaTime = 0.16;
class ComponentA extends Component {}
class ComponentB extends Component {}
class ComponentC extends Component {}

class EntityListenerMock {
    addedCount = 0;

    removedCount = 0;

    public entityAdded = (entity: Entity) => {
        ++this.addedCount;
        expect(entity).not.toBe(null);
    };

    public entityRemoved = (entity: Entity) => {
        ++this.removedCount;
        expect(entity).not.toBe(null);
    };
}

abstract class EntitySystemMockBase extends EntitySystem {
    updates: number[] | null = [];

    addedToEngineSpy: jest.SpyInstance;

    removedFromEngineSpy: jest.SpyInstance;

    updateSpy: jest.SpyInstance;

    constructor(updates: number[] | null = null) {
        super();
        this.updates = updates;
        this.addedToEngineSpy = jest.spyOn(this as any, "addedToEngine");
        this.removedFromEngineSpy = jest.spyOn(this as any, "removedFromEngine");
        this.updateSpy = jest.spyOn(this as any, "update");
    }

    public update(): void {
        if (this.updates != null) this.updates.push(this.getPriority());
    }
}

class EntitySystemMock extends EntitySystemMockBase {}

class EntitySystemMockA extends EntitySystemMockBase {
    constructor(updates: number[] | null = null) {
        super(updates);
    }
}

class EntitySystemMockB extends EntitySystemMockBase {
    constructor(updates: number[] | null = null) {
        super(updates);
    }
}

class CounterComponent extends Component {
    counter = 0;
}

class CounterSystem extends EntitySystem {
    entities: Entity[] | null = null;

    constructor(private onEntityRemove: (e: Entity) => void) {
        super();
    }

    protected addedToEngine(engine: Engine): void {
        super.addedToEngine(engine);
        this.entities = engine.getEntitiesFor(Family.all(CounterComponent).get());
    }

    public update() {
        const engine = this.getEngine();
        if (!engine) return;
        const entities = this.entities!;
        for (let i = 0; i < entities.length; ++i) {
            const e = entities[i];
            if (i % 2 === 0) {
                const cc = e.get(CounterComponent)!;
                cc.counter++;
            } else {
                engine.removeEntity(e);
                this.onEntityRemove(e);
            }
        }
    }
}

class UpdateSystem<T extends (engine: Engine) => any> extends EntitySystem {
    result: ReturnType<T> | null = null;

    constructor(private callback: T) {
        super();
    }

    public update() {
        const engine = this.getEngine();
        if (engine) this.result = this.callback(engine);
    }
}

class PositionComponent extends Component {
    x = 0.0;

    y = 0.0;
}

class CombinedSystem extends EntitySystem {
    entities: Entity[] | null = null;

    counter = 0;

    protected addedToEngine(engine: Engine): void {
        super.addedToEngine(engine);
        this.entities = engine.getEntitiesFor(Family.all(PositionComponent).get());
    }

    public update(): void {
        const engine = this.getEngine();
        if (engine) {
            if (this.counter >= 6 && this.counter <= 8) engine.removeEntity(this.entities![2]);
            this.counter++;
        }
    }
}

class RemoveEntityTwiceSystem extends EntitySystem {
    private entities: Entity[] | null = null;

    constructor(private onEntityCreated: (e: Entity) => void) {
        super();
    }

    protected addedToEngine(engine: Engine): void {
        super.addedToEngine(engine);
        this.entities = engine.getEntitiesFor(Family.all(PositionComponent).get());
    }

    public update() {
        const engine = this.getEngine();
        if (!engine) return;
        for (let i = 0; i < 10; i++) {
            const entity = engine.createEntity();
            this.onEntityCreated(entity);
            entity.flags = 1;
            entity.add(new PositionComponent());
            engine.addEntity(entity);
        }
        for (const entity of this.entities!) {
            engine.removeEntity(entity);
            engine.removeEntity(entity);
        }
    }
}

describe("Engine", () => {
    test("#isUpdating()", () => {
        const engine = new Engine();
        const system = engine.addSystem(new UpdateSystem((e) => e.isUpdating()));
        engine.update(deltaTime);
        expect(system.result).toBe(true);
    });

    test("#removeAllEntities()", () => {
        const engine = new Engine();
        engine.addEntity(engine.createEntity());
        engine.addEntity(engine.createEntity());
        expect(engine.getEntities()).toHaveLength(2);
        engine.addSystem(new UpdateSystem((e) => e.removeAllEntities()));
        engine.update(deltaTime);
        expect(engine.getEntities()).toHaveLength(0);
    });

    test("addAndRemoveEntity", () => {
        const engine = new Engine();

        const listenerA = new EntityListenerMock();
        const listenerB = new EntityListenerMock();

        engine.entityAdded.connect(listenerA.entityAdded);
        engine.entityRemoved.connect(listenerA.entityRemoved);
        const refBAdded = engine.entityAdded.connect(listenerB.entityAdded);
        const refBRemoved = engine.entityRemoved.connect(listenerB.entityRemoved);

        const entity1 = engine.createEntity();
        engine.addEntity(entity1);

        expect(listenerA.addedCount).toBe(1);
        expect(listenerB.addedCount).toBe(1);

        refBAdded.enabled = false;
        refBRemoved.enabled = false;

        const entity2 = engine.createEntity();
        engine.addEntity(entity2);

        expect(listenerA.addedCount).toBe(2);
        expect(listenerB.addedCount).toBe(1);

        refBAdded.enabled = true;
        refBRemoved.enabled = true;

        engine.removeAllEntities();

        expect(listenerA.removedCount).toBe(2);
        expect(listenerB.removedCount).toBe(2);
    });

    test("unaddedEntity", () => {
        const engine = new Engine();
        let entity = engine.createEntity();
        const component = entity.add(new ComponentA());
        expect(entity.get(ComponentA)).toBe(component);
        entity.add(component);
        expect(entity.get(ComponentA)).toBe(component);
        entity.remove(ComponentA);
        entity.remove(ComponentA); // twice
        entity.destroy();

        entity = engine.createEntity();
        engine.removeEntity(entity);
    });

    test("removeFromDifferentEngine", () => {
        const engine1 = new Engine();
        const engine2 = new Engine();
        const entity = engine1.createEntity();
        engine1.addEntity(entity);
        expect(() => engine2.removeEntity(entity)).toThrow();
    });

    test("addAndRemoveSystem", () => {
        const engine = new Engine();

        expect(engine.getSystem(EntitySystemMockA)).toBe(null);
        expect(engine.getSystem(EntitySystemMockB)).toBe(null);

        const systemA = engine.addSystem(new EntitySystemMockA());
        const systemB = engine.addSystem(new EntitySystemMockB());

        expect(engine.getSystem(EntitySystemMockA)).toBe(systemA);
        expect(engine.getSystem(EntitySystemMockB)).toBe(systemB);
        expect(systemA.addedToEngineSpy).toHaveBeenCalledTimes(1);
        expect(systemB.addedToEngineSpy).toHaveBeenCalledTimes(1);

        engine.removeSystem(EntitySystemMockA);
        engine.removeSystem(EntitySystemMockB);

        expect(engine.getSystem(EntitySystemMockA)).toBe(null);
        expect(engine.getSystem(EntitySystemMockB)).toBe(null);
        expect(systemA.removedFromEngineSpy).toHaveBeenCalledTimes(1);
        expect(systemB.removedFromEngineSpy).toHaveBeenCalledTimes(1);
    });

    test("getSystems", () => {
        const engine = new Engine();

        expect(engine.getSystems()).toHaveLength(0);

        engine.addSystem(new EntitySystemMockA());
        engine.addSystem(new EntitySystemMockB());

        expect(engine.getSystems()).toHaveLength(2);
    });

    test("systemUpdate", () => {
        const engine = new Engine();

        const systemA = engine.addSystem(new EntitySystemMockA());
        const systemB = engine.addSystem(new EntitySystemMockB());

        const numUpdates = 10;

        for (let i = 0; i < numUpdates; ++i) {
            engine.update(deltaTime);

            expect(systemA.updateSpy).toHaveBeenCalledTimes(i + 1);
            expect(systemB.updateSpy).toHaveBeenCalledTimes(i + 1);
        }

        engine.removeSystem(EntitySystemMockB);

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

        engine.addSystem(new EntitySystemMockA(updates)).setPriority(2);
        engine.addSystem(new EntitySystemMockB(updates)).setPriority(1);

        engine.sortSystems();

        engine.update(deltaTime);

        let previous = Number.MIN_VALUE;

        for (const value of updates) {
            expect(value).toBeGreaterThanOrEqual(previous);

            previous = value;
        }
    });

    test("ignoreSystem", () => {
        const engine = new Engine();

        const system = engine.addSystem(new EntitySystemMock());

        const numUpdates = 10;

        for (let i = 0; i < numUpdates; ++i) {
            system.setProcessing(i % 2 === 0);
            engine.update(deltaTime);
            expect(system.updateSpy).toHaveBeenCalledTimes(Math.floor(i / 2) + 1);
        }
    });

    test("entitiesForFamily", () => {
        const engine = new Engine();

        const family = Family.all(ComponentA, ComponentB).get();
        const familyEntities = engine.getEntitiesFor(family);

        expect(familyEntities).toHaveLength(0);

        const entity1 = engine.createEntity();
        const entity2 = engine.createEntity();
        const entity3 = engine.createEntity();
        const entity4 = engine.createEntity();

        entity1.add(new ComponentA());
        entity1.add(new ComponentB());

        entity2.add(new ComponentA());
        entity2.add(new ComponentC());

        entity3.add(new ComponentA());
        entity3.add(new ComponentB());
        entity3.add(new ComponentC());

        entity4.add(new ComponentA());
        entity4.add(new ComponentB());
        entity4.add(new ComponentC());

        engine.addEntity(entity1);
        engine.addEntity(entity2);
        engine.addEntity(entity3);
        engine.addEntity(entity4);

        expect(familyEntities).toHaveLength(3);
        expect(familyEntities.indexOf(entity1)).not.toBe(-1);
        expect(familyEntities.indexOf(entity3)).not.toBe(-1);
        expect(familyEntities.indexOf(entity4)).not.toBe(-1);
        expect(familyEntities.indexOf(entity2)).toBe(-1);
    });

    test("entityForFamilyWithRemoval", () => {
        // Test for issue #13
        const engine = new Engine();

        const entity = engine.createEntity();
        entity.add(new ComponentA());

        engine.addEntity(entity);

        const entities = engine.getEntitiesFor(Family.all(ComponentA).get());

        expect(entities).toHaveLength(1);
        expect(entities.indexOf(entity)).not.toBe(-1);

        engine.removeEntity(entity);

        expect(entities).toHaveLength(0);
        expect(entities.indexOf(entity)).toBe(-1);
    });

    test("entitiesForFamilyAfter", () => {
        const engine = new Engine();

        const family = Family.all(ComponentA, ComponentB).get();
        const familyEntities = engine.getEntitiesFor(family);

        expect(familyEntities).toHaveLength(0);

        const entity1 = engine.createEntity();
        const entity2 = engine.createEntity();
        const entity3 = engine.createEntity();
        const entity4 = engine.createEntity();

        engine.addEntity(entity1);
        engine.addEntity(entity2);
        engine.addEntity(entity3);
        engine.addEntity(entity4);

        entity1.add(new ComponentA());
        entity1.add(new ComponentB());

        entity2.add(new ComponentA());
        entity2.add(new ComponentC());

        entity3.add(new ComponentA());
        entity3.add(new ComponentB());
        entity3.add(new ComponentC());

        entity4.add(new ComponentA());
        entity4.add(new ComponentB());
        entity4.add(new ComponentC());

        expect(familyEntities).toHaveLength(3);
        expect(familyEntities.indexOf(entity1)).not.toBe(-1);
        expect(familyEntities.indexOf(entity3)).not.toBe(-1);
        expect(familyEntities.indexOf(entity4)).not.toBe(-1);
        expect(familyEntities.indexOf(entity2)).toBe(-1);
    });

    test("entitiesForFamilyWithRemoval", () => {
        const engine = new Engine();

        const family = Family.all(ComponentA, ComponentB).get();
        const familyEntities = engine.getEntitiesFor(family);

        const entity1 = engine.createEntity();
        const entity2 = engine.createEntity();
        const entity3 = engine.createEntity();
        const entity4 = engine.createEntity();

        engine.addEntity(entity1);
        engine.addEntity(entity2);
        engine.addEntity(entity3);
        engine.addEntity(entity4);

        entity1.add(new ComponentA());
        entity1.add(new ComponentB());

        entity2.add(new ComponentA());
        entity2.add(new ComponentC());

        entity3.add(new ComponentA());
        entity3.add(new ComponentB());
        entity3.add(new ComponentC());

        entity4.add(new ComponentA());
        entity4.add(new ComponentB());
        entity4.add(new ComponentC());

        expect(familyEntities).toHaveLength(3);
        expect(familyEntities.indexOf(entity1)).not.toBe(-1);
        expect(familyEntities.indexOf(entity3)).not.toBe(-1);
        expect(familyEntities.indexOf(entity4)).not.toBe(-1);
        expect(familyEntities.indexOf(entity2)).toBe(-1);

        entity1.remove(ComponentA);
        engine.removeEntity(entity3);

        expect(familyEntities).toHaveLength(1);
        expect(familyEntities.indexOf(entity4)).not.toBe(-1);
        expect(familyEntities.indexOf(entity1)).toBe(-1);
        expect(familyEntities.indexOf(entity3)).toBe(-1);
        expect(familyEntities.indexOf(entity2)).toBe(-1);
    });

    test("entitiesForFamilyWithRemovalAndFiltering", () => {
        const engine = new Engine();

        const entitiesWithComponentAOnly = engine.getEntitiesFor(Family.all(ComponentA).exclude(ComponentB).get());

        const entitiesWithComponentB = engine.getEntitiesFor(Family.all(ComponentB).get());

        const entity1 = engine.createEntity();
        const entity2 = engine.createEntity();

        engine.addEntity(entity1);
        engine.addEntity(entity2);

        entity1.add(new ComponentA());

        entity2.add(new ComponentA());
        entity2.add(new ComponentB());

        expect(entitiesWithComponentAOnly).toHaveLength(1);
        expect(entitiesWithComponentB).toHaveLength(1);

        entity2.remove(ComponentB);

        expect(entitiesWithComponentAOnly).toHaveLength(2);
        expect(entitiesWithComponentB).toHaveLength(0);
    });

    test("entitySystemRemovalWhileIterating", () => {
        const engine = new Engine();

        engine.addSystem(new CounterSystem((e) => expect(e.isScheduledForRemoval()).toBe(true)));

        for (let i = 0; i < 20; ++i) {
            const entity = engine.createEntity();
            entity.add(new CounterComponent());
            engine.addEntity(entity);
        }

        const entities = engine.getEntitiesFor(Family.all(CounterComponent).get());

        for (const e of entities) {
            const cc = e.get(CounterComponent);
            expect(cc).not.toBe(null);
            if (cc) expect(cc.counter).toBe(0);
        }

        engine.update(deltaTime);

        for (const e of entities) {
            const cc = e.get(CounterComponent);
            expect(cc).not.toBe(null);
            if (cc) expect(cc.counter).toBe(1);
        }
    });

    test("familyListener", () => {
        const engine = new Engine();

        const listenerA = new EntityListenerMock();
        const listenerB = new EntityListenerMock();

        const familyA = Family.all(ComponentA).get();
        const familyB = Family.all(ComponentB).get();

        engine.getEntityAddedSignal(familyA).connect(listenerA.entityAdded);
        engine.getEntityRemovedSignal(familyA).connect(listenerA.entityRemoved);

        const refBAdded = engine.getEntityAddedSignal(familyB).connect(listenerB.entityAdded);
        const refBRemoved = engine.getEntityRemovedSignal(familyB).connect(listenerB.entityRemoved);

        const entity1 = engine.createEntity();
        engine.addEntity(entity1);

        expect(listenerA.addedCount).toBe(0);
        expect(listenerB.addedCount).toBe(0);

        let entity2 = engine.createEntity();
        engine.addEntity(entity2);

        expect(listenerA.addedCount).toBe(0);
        expect(listenerB.addedCount).toBe(0);

        entity1.add(new ComponentA());

        expect(listenerA.addedCount).toBe(1);
        expect(listenerB.addedCount).toBe(0);

        entity2.add(new ComponentB());

        expect(listenerA.addedCount).toBe(1);
        expect(listenerB.addedCount).toBe(1);

        entity1.remove(ComponentA);

        expect(listenerA.removedCount).toBe(1);
        expect(listenerB.removedCount).toBe(0);

        engine.removeEntity(entity2);

        expect(listenerA.removedCount).toBe(1);
        expect(listenerB.removedCount).toBe(1);

        refBAdded.enabled = false;
        refBRemoved.enabled = false;

        entity2 = engine.createEntity();
        entity2.add(new ComponentB());
        engine.addEntity(entity2);

        expect(listenerA.addedCount).toBe(1);
        expect(listenerB.addedCount).toBe(1);

        entity1.add(new ComponentB());
        entity1.add(new ComponentA());

        expect(listenerA.addedCount).toBe(2);
        expect(listenerB.addedCount).toBe(1);

        engine.removeAllEntities();

        expect(listenerA.removedCount).toBe(2);
        expect(listenerB.removedCount).toBe(1);

        refBAdded.enabled = true;
        refBRemoved.enabled = true;
    });

    test("sameEntitySignals", () => {
        const familyA = Family.all(ComponentA).get();
        const familyB = Family.all(ComponentB).get();
        const engine = new Engine();
        const sigA = engine.getEntityAddedSignal(familyA);
        const sigB = engine.getEntityAddedSignal(familyB);
        expect(engine.getEntityAddedSignal(familyA)).toBe(sigA);
        expect(engine.getEntityAddedSignal(familyB)).toBe(sigB);
        expect(engine.getEntityAddedSignal(familyB)).not.toBe(sigA);
    });

    test("createManyEntitiesNoStackOverflow", () => {
        const engine = new Engine();
        engine.addSystem(new CounterSystem((e) => expect(e.isScheduledForRemoval()).toBe(true)));

        for (let i = 0; i < 15000; i++) {
            const e = engine.createEntity();
            e.add(new ComponentB());
            engine.addEntity(e);
        }

        engine.update(0);
    });

    test("getEntityById", () => {
        const engine = new Engine();
        const entity = engine.createEntity();

        expect(entity.getId()).toBe(0);
        expect(entity.isValid()).toBe(false);

        engine.addEntity(entity);

        expect(entity.isValid()).toBe(true);

        const entityId = entity.getId();

        expect(entityId).not.toBe(0);

        expect(engine.getEntity(entityId)).toBe(entity);

        engine.removeEntity(entity);

        expect(engine.getEntity(entityId)).toBe(null);
    });

    test("getEntities", () => {
        const numEntities = 10;

        const engine = new Engine();

        const entities: Entity[] = [];
        for (let i = 0; i < numEntities; ++i) {
            const entity = engine.createEntity();
            entities.push(entity);
            engine.addEntity(entity);
        }

        const engineEntities = engine.getEntities();

        expect(entities).toHaveSameOrderedMembers(engineEntities);

        engine.removeAllEntities();

        expect(engineEntities).toHaveLength(0);
    });

    test("addEntityTwice", () => {
        const engine = new Engine();
        const entity = engine.createEntity();
        engine.addEntity(entity);

        expect(() => engine.addEntity(entity)).toThrow();
    });

    test("addTwoSystemsOfSameClass", () => {
        const engine = new Engine();

        expect(engine.getSystems()).toHaveLength(0);
        const system1 = engine.addSystem(new EntitySystemMockA());

        expect(engine.getSystems()).toHaveLength(1);
        expect(engine.getSystem(EntitySystemMockA)).toBe(system1);

        const system2 = engine.addSystem(new EntitySystemMockA());

        expect(engine.getSystems()).toHaveLength(1);
        expect(engine.getSystem(EntitySystemMockA)).toBe(system2);
    });

    test("entityRemovalListenerOrder", () => {
        const engine = new Engine();

        const combinedSystem = engine.addSystem(new CombinedSystem());

        const signal = engine.getEntityRemovedSignal(Family.all(PositionComponent).get());
        signal.connect((entity) => {
            expect(entity.get(PositionComponent)).not.toBe(null);
        });

        for (let i = 0; i < 10; i++) {
            const entity = engine.createEntity();
            entity.add(new PositionComponent());
            engine.addEntity(entity);
        }

        expect(combinedSystem.entities!).toHaveLength(10);

        for (let i = 0; i < 10; i++) engine.update(deltaTime);

        engine.removeAllEntities();
    });

    test("removeEntityTwice", () => {
        const engine = new Engine();
        engine.addSystem(new RemoveEntityTwiceSystem((e) => expect(e.flags).toBe(0)));

        for (let j = 0; j < 2; j++) engine.update(0);
    });

    test("destroyEntity", () => {
        const engine = new Engine();
        const entity = engine.createEntity();
        engine.addEntity(entity);
        expect(entity.isValid()).toBe(true);
        entity.destroy();
    });

    test("removeEntities", () => {
        const engine = new Engine();

        const numEntities = 200;
        const entities: Entity[] = [];

        for (let i = 0; i < numEntities; ++i) {
            const entity = engine.createEntity();
            engine.addEntity(entity);
            entities.push(entity);

            expect(entity.isValid()).toBe(true);
        }

        for (const entity of entities) {
            engine.removeEntity(entity);
        }
    });
});
