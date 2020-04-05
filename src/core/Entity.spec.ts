import { Component } from "./Component";
import { UniqueType } from "./UniqueType";
import { Engine } from "./Engine";
import { Bits } from "../utils/Bits";

class ComponentA extends Component {}
class ComponentB extends Component {}

describe("Entity", () => {
    test("uniqueIndex", () => {
        const numEntities = 10000;
        const ids = new Bits(numEntities + 1);
        const engine = new Engine();

        for (let i = 0; i < numEntities; ++i) {
            const entity = engine.createEntity();
            engine.addEntity(entity);
            expect(ids.getAndSet(entity.getId())).toBe(false);
        }
    });

    test("noComponents", () => {
        const engine = new Engine();
        const entity = engine.createEntity();
        engine.addEntity(entity);

        expect(entity.getAll()).toHaveLength(0);
        expect(entity.getComponentBits().isEmpty()).toBe(true);
        expect(entity.get(ComponentA)).toBe(null);
        expect(entity.get(ComponentB)).toBe(null);
        expect(entity.has(ComponentA)).toBe(false);
        expect(entity.has(ComponentB)).toBe(false);
    });

    test("addAndRemoveComponent", () => {
        const engine = new Engine();
        const entity = engine.createEntity();
        engine.addEntity(entity);

        entity.add(new ComponentA());

        expect(entity.getAll()).toHaveLength(1);

        const componentBits = entity.getComponentBits();
        const componentAIndex = UniqueType.getForClass(ComponentA).getIndex();

        for (let i = 0; i < componentBits.length(); ++i) {
            expect(componentBits.get(i)).toBe(i === componentAIndex);
        }

        expect(entity.get(ComponentA)).not.toBe(null);
        expect(entity.get(ComponentB)).toBe(null);
        expect(entity.has(ComponentA)).toBe(true);
        expect(entity.has(ComponentB)).toBe(false);

        entity.remove(ComponentA);

        expect(entity.getAll()).toHaveLength(0);

        for (let i = 0; i < componentBits.length(); ++i) {
            expect(componentBits.get(i)).toBe(false);
        }

        expect(entity.get(ComponentA)).toBe(null);
        expect(entity.get(ComponentB)).toBe(null);
        expect(entity.has(ComponentA)).toBe(false);
        expect(entity.has(ComponentB)).toBe(false);
    });

    test("addAndRemoveAllComponents", () => {
        const engine = new Engine();
        const entity = engine.createEntity();
        engine.addEntity(entity);
        entity.add(new ComponentA());
        entity.add(new ComponentB());

        expect(entity.getAll()).toHaveLength(2);

        const componentBits = entity.getComponentBits();
        const componentAIndex = UniqueType.getForClass(ComponentA).getIndex();
        const componentBIndex = UniqueType.getForClass(ComponentB).getIndex();

        for (let i = 0; i < componentBits.length(); ++i) {
            expect(componentBits.get(i)).toBe(i === componentAIndex || i === componentBIndex);
        }

        expect(entity.get(ComponentA)).not.toBe(null);
        expect(entity.get(ComponentB)).not.toBe(null);
        expect(entity.has(ComponentA)).toBe(true);
        expect(entity.has(ComponentB)).toBe(true);

        entity.removeAll();

        expect(entity.getAll()).toHaveLength(0);

        for (let i = 0; i < componentBits.length(); ++i) {
            expect(componentBits.get(i)).toBe(false);
        }

        expect(entity.get(ComponentA)).toBe(null);
        expect(entity.get(ComponentB)).toBe(null);
        expect(entity.has(ComponentA)).toBe(false);
        expect(entity.has(ComponentB)).toBe(false);
    });

    test("addSameComponent", () => {
        const engine = new Engine();
        const entity = engine.createEntity();
        engine.addEntity(entity);

        const a1 = entity.add(new ComponentA());
        const a2 = entity.add(new ComponentA());

        expect(entity.getAll()).toHaveLength(1);
        expect(entity.has(ComponentA)).toBe(true);
        expect(a1 === entity.get(ComponentA)).toBe(false);
        expect(entity.get(ComponentA)).toBe(a2);
    });

    test("getComponentByClass", () => {
        const engine = new Engine();
        const entity = engine.createEntity();
        engine.addEntity(entity);

        const compA = entity.add(new ComponentA());
        const compB = entity.add(new ComponentB());

        const retA = entity.get(ComponentA);
        const retB = entity.get(ComponentB);

        expect(retA).not.toBe(null);
        expect(retB).not.toBe(null);

        expect(retA).toBe(compA);
        expect(retB).toBe(compB);
    });
});
