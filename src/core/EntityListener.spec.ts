import { Component } from "./Component";
import { Entity } from "./Entity";
import { Engine } from "./Engine";
import { Family } from "./Family";
import { EntitySystem } from "./EntitySystem";

class EntityRemoverSystem extends EntitySystem {
    entity: Entity;

    public constructor(entity: Entity) {
        super();
        this.entity = entity;
    }

    public update(): void {
        const engine = this.getEngine();
        if (engine) engine.removeEntity(this.entity);
    }
}

class PositionComponent extends Component {}

describe("EntityListener", () => {
    test("add_entity_listener_family_remove", () => {
        const engine = new Engine();

        const e = engine.createEntity();
        e.add(new PositionComponent());
        engine.addEntity(e);

        const signal = engine.getEntityRemovedSignal(Family.all(PositionComponent).get());
        signal.connect(() => {
            engine.addEntity(engine.createEntity());
        });

        engine.removeEntity(e);
        expect(engine.getEntities()).toHaveLength(0);
        engine.update(0);
        expect(engine.getEntities()).toHaveLength(1);
    });

    test("addEntityListenerFamilyAdd", () => {
        const engine = new Engine();

        const e = engine.createEntity();
        e.add(new PositionComponent());

        const signal = engine.getEntityAddedSignal(Family.all(PositionComponent).get());
        const ref = signal.connect(() => engine.addEntity(engine.createEntity()));

        engine.addEntity(e);
        ref.disconnect();
        expect(engine.getEntities()).toHaveLength(1);
        engine.update(0);
        expect(engine.getEntities()).toHaveLength(2);
    });

    test("addEntityListenerNoFamilyRemove", () => {
        const engine = new Engine();

        const e = engine.createEntity();
        e.add(new PositionComponent());
        engine.addEntity(e);
        const family = Family.all(PositionComponent).get();
        const signal = engine.getEntityRemovedSignal(family);
        const ref = signal.connect((entity) => {
            if (family.matches(entity)) engine.addEntity(engine.createEntity());
        });

        engine.removeEntity(e);
        ref.disconnect();
        expect(engine.getEntities()).toHaveLength(0);
        engine.update(0);
        expect(engine.getEntities()).toHaveLength(1);
    });

    test("addEntityListenerNoFamilyAdd", () => {
        const engine = new Engine();

        const e = engine.createEntity();
        e.add(new PositionComponent());

        const family = Family.all(PositionComponent).get();
        const signal = engine.getEntityAddedSignal(family);
        signal.connect((entity) => {
            if (family.matches(entity)) engine.addEntity(engine.createEntity());
        });

        engine.addEntity(e);
        expect(engine.getEntities()).toHaveLength(1);
        engine.update(0);
        expect(engine.getEntities()).toHaveLength(2);
    });

    test("remove_entity_during_entity_removal", () => {
        const engine = new Engine();

        const e1 = engine.createEntity();
        const e2 = engine.createEntity();
        engine.addEntity(e1);
        engine.addEntity(e2);

        engine.addSystem(new EntityRemoverSystem(e1));

        engine.entityRemoved.connect((entity) => {
            if (entity === e1) engine.removeEntity(e2);
        });
        expect(engine.getEntities()).toHaveLength(2);
        engine.update(0.16);
        expect(engine.getEntities()).toHaveLength(0);
    });
});
