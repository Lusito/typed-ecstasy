/* eslint-disable dot-notation */
import { Entity, Engine, Family, EntitySystem, service } from "typed-ecstasy";

import { declareComponent, declareMarkerComponent } from "./Component";

const deltaTime = 0.16;
const ComponentA = declareMarkerComponent("A");
const ComponentB = declareMarkerComponent("B");
const ComponentC = declareMarkerComponent("C");

class EntityListenerMock {
    public addedCount = 0;

    public removedCount = 0;

    public entityAdded = (entity: Entity) => {
        ++this.addedCount;
        expect(entity).toBeTruthy();
    };

    public entityRemoved = (entity: Entity) => {
        ++this.removedCount;
        expect(entity).toBeTruthy();
    };
}

@service()
class EntitySystemMock extends EntitySystem {
    public updates: number[] | null = [];

    public id = 0;

    public updateSpy: jest.SpyInstance;

    public constructor(engine: Engine) {
        super(engine);
        this.onEnable = jest.fn();
        this.onDisable = jest.fn();
        this.updateSpy = jest.spyOn(this as any, "update");
    }

    public override update(): void {
        if (this.updates != null) this.updates.push(this.id);
    }
}

@service()
class UpdateSystem<T> extends EntitySystem {
    public result: T | null = null;

    public callback = (_engine: Engine) => ({} as T);

    public override update() {
        this.result = this.callback(this.engine);
    }
}

interface PositionData {
    x: number;
    y: number;
}

const PositionComponent = declareComponent("Position").withoutConfig<PositionData>({
    reset(comp) {
        comp.x = 0;
        comp.y = 0;
    },
});

@service()
class CombinedSystem extends EntitySystem {
    public entities: Entity[] | null = null;

    public counter = 0;

    protected override onEnable(): void {
        this.entities = this.engine.entities.forFamily(Family.all(PositionComponent).get());
    }

    public override update(): void {
        if (this.counter >= 6 && this.counter <= 8) this.engine.entities.remove(this.entities![2]);
        this.counter++;
    }
}

@service()
class RemoveEntityTwiceSystem extends EntitySystem {
    private entities: Entity[] | null = null;

    public onEntityCreated: (e: Entity) => void = (() => 0) as any;

    protected override onEnable(): void {
        this.entities = this.engine.entities.forFamily(Family.all(PositionComponent).get());
    }

    public override update() {
        const { engine } = this;
        for (let i = 0; i < 10; i++) {
            const entity = new Entity();
            this.onEntityCreated(entity);
            entity.flags = 1;
            entity.add(engine.obtainComponent(PositionComponent)!);
            engine.entities.add(entity);
        }
        for (const entity of this.entities!) {
            engine.entities.remove(entity);
            engine.entities.remove(entity);
        }
    }
}

@service()
class EntityRemoverSystem extends EntitySystem {
    public entity: Entity = 0 as any;

    public override update(): void {
        this.engine.entities.remove(this.entity);
    }
}

describe("EntityManager", () => {
    test("removeAll()", () => {
        const engine = new Engine();
        engine.entities.add(new Entity());
        engine.entities.add(new Entity());
        expect(engine.entities.getAll()).toHaveLength(2);
        const system = engine.systems.add(UpdateSystem);
        system.callback = (e) => e.entities.removeAll();
        engine.update(deltaTime);
        expect(engine.entities.getAll()).toHaveLength(0);
    });

    test("addAndRemoveEntity", () => {
        const engine = new Engine();

        const listenerA = new EntityListenerMock();
        const listenerB = new EntityListenerMock();

        engine.entities.onAdd.connect(listenerA.entityAdded);
        engine.entities.onRemove.connect(listenerA.entityRemoved);
        const refBAdded = engine.entities.onAdd.connect(listenerB.entityAdded);
        const refBRemoved = engine.entities.onRemove.connect(listenerB.entityRemoved);

        const entity1 = new Entity();
        engine.entities.add(entity1);

        expect(listenerA.addedCount).toBe(1);
        expect(listenerB.addedCount).toBe(1);

        refBAdded.enabled = false;
        refBRemoved.enabled = false;

        const entity2 = new Entity();
        engine.entities.add(entity2);

        expect(listenerA.addedCount).toBe(2);
        expect(listenerB.addedCount).toBe(1);

        refBAdded.enabled = true;
        refBRemoved.enabled = true;

        engine.entities.removeAll();

        expect(listenerA.removedCount).toBe(2);
        expect(listenerB.removedCount).toBe(2);
    });

    test("unaddedEntity", () => {
        const engine = new Engine();
        let entity = new Entity();
        const component = entity.add(engine.obtainComponent(ComponentA)!);
        expect(entity.get(ComponentA)).toBe(component);
        entity.add(component);
        expect(entity.get(ComponentA)).toBe(component);
        entity.remove(ComponentA);
        entity.remove(ComponentA); // twice
        entity.destroy();

        entity = new Entity();
        engine.entities.remove(entity);
    });

    test("removeFromDifferentEngine", () => {
        const engine1 = new Engine();
        const engine2 = new Engine();
        const entity = new Entity();
        engine1.entities.add(entity);
        expect(() => engine2.entities.remove(entity)).toThrow();
    });

    test("entitiesForFamily", () => {
        const engine = new Engine();

        const family = Family.all(ComponentA, ComponentB).get();
        const familyEntities = engine.entities.forFamily(family);

        expect(familyEntities).toHaveLength(0);

        const entity1 = new Entity();
        const entity2 = new Entity();
        const entity3 = new Entity();
        const entity4 = new Entity();

        entity1.add(engine.obtainComponent(ComponentA)!);
        entity1.add(engine.obtainComponent(ComponentB)!);

        entity2.add(engine.obtainComponent(ComponentA)!);
        entity2.add(engine.obtainComponent(ComponentC)!);

        entity3.add(engine.obtainComponent(ComponentA)!);
        entity3.add(engine.obtainComponent(ComponentB)!);
        entity3.add(engine.obtainComponent(ComponentC)!);

        entity4.add(engine.obtainComponent(ComponentA)!);
        entity4.add(engine.obtainComponent(ComponentB)!);
        entity4.add(engine.obtainComponent(ComponentC)!);

        engine.entities.add(entity1);
        engine.entities.add(entity2);
        engine.entities.add(entity3);
        engine.entities.add(entity4);

        expect(familyEntities).toHaveLength(3);
        expect(familyEntities.indexOf(entity1)).not.toBe(-1);
        expect(familyEntities.indexOf(entity3)).not.toBe(-1);
        expect(familyEntities.indexOf(entity4)).not.toBe(-1);
        expect(familyEntities.indexOf(entity2)).toBe(-1);
    });

    test("entityForFamilyWithRemoval", () => {
        // Test for issue #13
        const engine = new Engine();

        const entity = new Entity();
        entity.add(engine.obtainComponent(ComponentA)!);

        engine.entities.add(entity);

        const entities = engine.entities.forFamily(Family.all(ComponentA).get());

        expect(entities).toHaveLength(1);
        expect(entities.indexOf(entity)).not.toBe(-1);

        engine.entities.remove(entity);

        expect(entities).toHaveLength(0);
        expect(entities.indexOf(entity)).toBe(-1);
    });

    test("entitiesForFamilyAfter", () => {
        const engine = new Engine();

        const family = Family.all(ComponentA, ComponentB).get();
        const familyEntities = engine.entities.forFamily(family);

        expect(familyEntities).toHaveLength(0);

        const entity1 = new Entity();
        const entity2 = new Entity();
        const entity3 = new Entity();
        const entity4 = new Entity();

        engine.entities.add(entity1);
        engine.entities.add(entity2);
        engine.entities.add(entity3);
        engine.entities.add(entity4);

        entity1.add(engine.obtainComponent(ComponentA)!);
        entity1.add(engine.obtainComponent(ComponentB)!);

        entity2.add(engine.obtainComponent(ComponentA)!);
        entity2.add(engine.obtainComponent(ComponentC)!);

        entity3.add(engine.obtainComponent(ComponentA)!);
        entity3.add(engine.obtainComponent(ComponentB)!);
        entity3.add(engine.obtainComponent(ComponentC)!);

        entity4.add(engine.obtainComponent(ComponentA)!);
        entity4.add(engine.obtainComponent(ComponentB)!);
        entity4.add(engine.obtainComponent(ComponentC)!);

        expect(familyEntities).toHaveLength(3);
        expect(familyEntities.indexOf(entity1)).not.toBe(-1);
        expect(familyEntities.indexOf(entity3)).not.toBe(-1);
        expect(familyEntities.indexOf(entity4)).not.toBe(-1);
        expect(familyEntities.indexOf(entity2)).toBe(-1);
    });

    test("entitiesForFamilyWithRemoval", () => {
        const engine = new Engine();

        const family = Family.all(ComponentA, ComponentB).get();
        const familyEntities = engine.entities.forFamily(family);

        const entity1 = new Entity();
        const entity2 = new Entity();
        const entity3 = new Entity();
        const entity4 = new Entity();

        engine.entities.add(entity1);
        engine.entities.add(entity2);
        engine.entities.add(entity3);
        engine.entities.add(entity4);

        entity1.add(engine.obtainComponent(ComponentA)!);
        entity1.add(engine.obtainComponent(ComponentB)!);

        entity2.add(engine.obtainComponent(ComponentA)!);
        entity2.add(engine.obtainComponent(ComponentC)!);

        entity3.add(engine.obtainComponent(ComponentA)!);
        entity3.add(engine.obtainComponent(ComponentB)!);
        entity3.add(engine.obtainComponent(ComponentC)!);

        entity4.add(engine.obtainComponent(ComponentA)!);
        entity4.add(engine.obtainComponent(ComponentB)!);
        entity4.add(engine.obtainComponent(ComponentC)!);

        expect(familyEntities).toHaveLength(3);
        expect(familyEntities.indexOf(entity1)).not.toBe(-1);
        expect(familyEntities.indexOf(entity3)).not.toBe(-1);
        expect(familyEntities.indexOf(entity4)).not.toBe(-1);
        expect(familyEntities.indexOf(entity2)).toBe(-1);

        entity1.remove(ComponentA);
        engine.entities.remove(entity3);

        expect(familyEntities).toHaveLength(1);
        expect(familyEntities.indexOf(entity4)).not.toBe(-1);
        expect(familyEntities.indexOf(entity1)).toBe(-1);
        expect(familyEntities.indexOf(entity3)).toBe(-1);
        expect(familyEntities.indexOf(entity2)).toBe(-1);
    });

    test("entitiesForFamilyWithRemovalAndFiltering", () => {
        const engine = new Engine();

        const entitiesWithComponentAOnly = engine.entities.forFamily(Family.all(ComponentA).exclude(ComponentB).get());

        const entitiesWithComponentB = engine.entities.forFamily(Family.all(ComponentB).get());

        const entity1 = new Entity();
        const entity2 = new Entity();

        engine.entities.add(entity1);
        engine.entities.add(entity2);

        entity1.add(engine.obtainComponent(ComponentA)!);

        entity2.add(engine.obtainComponent(ComponentA)!);
        entity2.add(engine.obtainComponent(ComponentB)!);

        expect(entitiesWithComponentAOnly).toHaveLength(1);
        expect(entitiesWithComponentB).toHaveLength(1);

        entity2.remove(ComponentB);

        expect(entitiesWithComponentAOnly).toHaveLength(2);
        expect(entitiesWithComponentB).toHaveLength(0);
    });

    test("familyListener", () => {
        const engine = new Engine();

        const listenerA = new EntityListenerMock();
        const listenerB = new EntityListenerMock();

        const familyA = Family.all(ComponentA).get();
        const familyB = Family.all(ComponentB).get();

        engine.entities.onAddForFamily(familyA).connect(listenerA.entityAdded);
        engine.entities.onRemoveForFamily(familyA).connect(listenerA.entityRemoved);

        const refBAdded = engine.entities.onAddForFamily(familyB).connect(listenerB.entityAdded);
        const refBRemoved = engine.entities.onRemoveForFamily(familyB).connect(listenerB.entityRemoved);

        const entity1 = new Entity();
        engine.entities.add(entity1);

        expect(listenerA.addedCount).toBe(0);
        expect(listenerB.addedCount).toBe(0);

        let entity2 = new Entity();
        engine.entities.add(entity2);

        expect(listenerA.addedCount).toBe(0);
        expect(listenerB.addedCount).toBe(0);

        entity1.add(engine.obtainComponent(ComponentA)!);

        expect(listenerA.addedCount).toBe(1);
        expect(listenerB.addedCount).toBe(0);

        entity2.add(engine.obtainComponent(ComponentB)!);

        expect(listenerA.addedCount).toBe(1);
        expect(listenerB.addedCount).toBe(1);

        entity1.remove(ComponentA);

        expect(listenerA.removedCount).toBe(1);
        expect(listenerB.removedCount).toBe(0);

        engine.entities.remove(entity2);

        expect(listenerA.removedCount).toBe(1);
        expect(listenerB.removedCount).toBe(1);

        refBAdded.enabled = false;
        refBRemoved.enabled = false;

        entity2 = new Entity();
        entity2.add(engine.obtainComponent(ComponentB)!);
        engine.entities.add(entity2);

        expect(listenerA.addedCount).toBe(1);
        expect(listenerB.addedCount).toBe(1);

        entity1.add(engine.obtainComponent(ComponentB)!);
        entity1.add(engine.obtainComponent(ComponentA)!);

        expect(listenerA.addedCount).toBe(2);
        expect(listenerB.addedCount).toBe(1);

        engine.entities.removeAll();

        expect(listenerA.removedCount).toBe(2);
        expect(listenerB.removedCount).toBe(1);

        refBAdded.enabled = true;
        refBRemoved.enabled = true;
    });

    test("sameEntitySignals", () => {
        const familyA = Family.all(ComponentA).get();
        const familyB = Family.all(ComponentB).get();
        const engine = new Engine();
        const sigA = engine.entities.onAddForFamily(familyA);
        const sigB = engine.entities.onAddForFamily(familyB);
        expect(engine.entities.onAddForFamily(familyA)).toBe(sigA);
        expect(engine.entities.onAddForFamily(familyB)).toBe(sigB);
        expect(engine.entities.onAddForFamily(familyB)).not.toBe(sigA);
    });

    test("getEntityById", () => {
        const engine = new Engine();
        const entity = new Entity();

        expect(entity.getId()).toBe(0);

        engine.entities.add(entity);

        const entityId = entity.getId();

        expect(entityId).not.toBe(0);

        expect(engine.entities.get(entityId)).toBe(entity);

        engine.entities.remove(entity);

        expect(engine.entities.get(entityId)).toBeUndefined();
    });

    test("getAll", () => {
        const numEntities = 10;

        const engine = new Engine();

        const entities: Entity[] = [];
        for (let i = 0; i < numEntities; ++i) {
            const entity = new Entity();
            entities.push(entity);
            engine.entities.add(entity);
        }

        const engineEntities = engine.entities.getAll();

        expect(entities).toHaveSameOrderedMembers(engineEntities);

        engine.entities.removeAll();

        expect(engineEntities).toHaveLength(0);
    });

    test("addEntityTwice", () => {
        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);

        expect(() => engine.entities.add(entity)).toThrow();
    });

    test("addTwoSystemsOfSameClass", () => {
        const engine = new Engine();

        expect(engine.systems.getAll()).toHaveLength(0);
        const system1 = engine.systems.add(EntitySystemMock);

        expect(engine.systems.getAll()).toHaveLength(1);
        expect(engine.systems.get(EntitySystemMock)).toBe(system1);

        const system2 = engine.systems.add(EntitySystemMock);

        expect(engine.systems.getAll()).toHaveLength(1);
        expect(engine.systems.get(EntitySystemMock)).toBe(system2);
    });

    test("entityRemovalListenerOrder", () => {
        const engine = new Engine();

        const combinedSystem = engine.systems.add(CombinedSystem);

        const signal = engine.entities.onRemoveForFamily(Family.all(PositionComponent).get());
        signal.connect((entity) => {
            expect(entity.get(PositionComponent)).not.toBeUndefined();
        });

        for (let i = 0; i < 10; i++) {
            const entity = new Entity();
            entity.add(engine.obtainComponent(PositionComponent)!);
            engine.entities.add(entity);
        }

        expect(combinedSystem.entities!).toHaveLength(10);

        for (let i = 0; i < 10; i++) engine.update(deltaTime);

        engine.entities.removeAll();
    });

    test("removeEntityTwice", () => {
        const engine = new Engine();
        const system = engine.systems.add(RemoveEntityTwiceSystem);
        system.onEntityCreated = (e) => expect(e.flags).toBe(0);

        for (let j = 0; j < 2; j++) engine.update(0);
    });

    test("destroyEntity", () => {
        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);
        expect(entity.getId()).toBeGreaterThan(0);
        entity.destroy();
    });

    test("removeEntities", () => {
        const engine = new Engine();

        const numEntities = 200;
        const entities: Entity[] = [];

        for (let i = 0; i < numEntities; ++i) {
            const entity = new Entity();
            engine.entities.add(entity);
            entities.push(entity);

            expect(entity.isScheduledForRemoval()).toBe(false);
        }

        for (const entity of entities) {
            engine.entities.remove(entity);
            expect(entity.isScheduledForRemoval()).toBe(true);
        }
    });

    test("add_entity_listener_family_remove", () => {
        const engine = new Engine();

        const e = new Entity();
        e.add(engine.obtainComponent(PositionComponent)!);
        engine.entities.add(e);

        const signal = engine.entities.onRemoveForFamily(Family.all(PositionComponent).get());
        const e2 = new Entity();
        signal.connect(() => {
            expect(e2.getId()).toBe(0);
            engine.entities.add(e2);
        });

        expect(engine.entities.getAll()).toHaveSameOrderedMembers([e]);
        engine.entities.remove(e);
        expect(engine.entities.getAll()).toHaveSameOrderedMembers([e2]);
    });

    test("addEntityListenerFamilyAdd", () => {
        const engine = new Engine();

        const e = new Entity();
        e.add(engine.obtainComponent(PositionComponent)!);

        const signal = engine.entities.onAddForFamily(Family.all(PositionComponent).get());
        const e2 = new Entity();
        signal.connect(() => {
            expect(e2.getId()).toBe(0);
            engine.entities.add(e2);
        });

        engine.entities.add(e);
        expect(engine.entities.getAll()).toHaveSameOrderedMembers([e, e2]);
    });

    test("addEntityListenerNoFamilyRemove", () => {
        const engine = new Engine();

        const e = new Entity();
        e.add(engine.obtainComponent(PositionComponent)!);
        engine.entities.add(e);
        const family = Family.all(PositionComponent).get();
        const signal = engine.entities.onRemoveForFamily(family);
        const e2 = new Entity();
        signal.connect((entity) => {
            expect(e2.getId()).toBe(0);
            if (family.matches(entity)) engine.entities.add(e2);
        });

        engine.entities.remove(e);
        expect(engine.entities.getAll()).toHaveSameOrderedMembers([e2]);
    });

    test("addEntityListenerNoFamilyAdd", () => {
        const engine = new Engine();

        const e = new Entity();
        e.add(engine.obtainComponent(PositionComponent)!);

        const family = Family.all(PositionComponent).get();
        const signal = engine.entities.onAddForFamily(family);
        const e2 = new Entity();
        signal.connect((entity) => {
            expect(e2.getId()).toBe(0);
            if (family.matches(entity)) engine.entities.add(e2);
        });

        engine.entities.add(e);
        expect(engine.entities.getAll()).toHaveSameOrderedMembers([e, e2]);
    });

    test("remove_entity_during_entity_removal", () => {
        const engine = new Engine();

        const e1 = new Entity();
        const e2 = new Entity();
        engine.entities.add(e1);
        engine.entities.add(e2);

        const system = engine.systems.add(EntityRemoverSystem);
        system.entity = e1;

        engine.entities.onRemove.connect((entity) => {
            if (entity === e1) engine.entities.remove(e2);
        });
        expect(engine.entities.getAll()).toHaveLength(2);
        engine.update(0.16);
        expect(engine.entities.getAll()).toHaveLength(0);
    });
});
