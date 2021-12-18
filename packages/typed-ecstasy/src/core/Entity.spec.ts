import { Engine, Entity } from "typed-ecstasy";

import { declareMarkerComponent } from "./Component";

const ComponentA = declareMarkerComponent("A");
const ComponentB = declareMarkerComponent("B");
const ComponentC = declareMarkerComponent("C");

describe("Entity", () => {
    test("uniqueIndex", () => {
        const numEntities = 10000;
        const ids = new Set<number>();
        const engine = new Engine();

        for (let i = 0; i < numEntities; ++i) {
            const entity = new Entity();
            engine.entities.add(entity);
            expect(ids.has(entity.getId())).toBe(false);
            ids.add(entity.getId());
        }
    });

    test("noComponents", () => {
        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);

        expect(entity.getAll()).toHaveLength(0);
        expect(entity.get(ComponentA)).toBeUndefined();
        expect(entity.get(ComponentB)).toBeUndefined();
        expect(entity.has(ComponentA)).toBe(false);
        expect(entity.has(ComponentB)).toBe(false);
    });

    test("addAndRemoveComponent", () => {
        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);

        entity.add(engine.obtainComponent(ComponentA)!);

        const components = entity.getAll();
        for (let i = 0; i < components.length; ++i) {
            if (i === ComponentA.id) expect(components[i]).toBeDefined();
            else expect(components[i]).toBeUndefined();
        }

        expect(entity.get(ComponentA)).not.toBeUndefined();
        expect(entity.get(ComponentB)).toBeUndefined();
        expect(entity.has(ComponentA)).toBe(true);
        expect(entity.has(ComponentB)).toBe(false);

        entity.remove(ComponentA);

        for (const component of components) {
            expect(component).toBeUndefined();
        }

        expect(entity.get(ComponentA)).toBeUndefined();
        expect(entity.get(ComponentB)).toBeUndefined();
        expect(entity.has(ComponentA)).toBe(false);
        expect(entity.has(ComponentB)).toBe(false);
    });

    test("addAndRemoveAllComponents", () => {
        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);
        entity.add(engine.obtainComponent(ComponentA)!);
        entity.add(engine.obtainComponent(ComponentB)!);

        const components = entity.getAll();

        for (let i = 0; i < components.length; ++i) {
            if (i === ComponentA.id || i === ComponentB.id) expect(components[i]).toBeDefined();
            else expect(components[i]).toBeUndefined();
        }

        expect(entity.get(ComponentA)).not.toBeUndefined();
        expect(entity.get(ComponentB)).not.toBeUndefined();
        expect(entity.has(ComponentA)).toBe(true);
        expect(entity.has(ComponentB)).toBe(true);

        entity.removeAll();

        expect(entity.getAll()).toHaveLength(0);

        for (const component of components) {
            expect(component).toBeUndefined();
        }

        expect(entity.get(ComponentA)).toBeUndefined();
        expect(entity.get(ComponentB)).toBeUndefined();
        expect(entity.has(ComponentA)).toBe(false);
        expect(entity.has(ComponentB)).toBe(false);
    });

    test("addSameComponent", () => {
        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);

        const a1 = entity.add(engine.obtainComponent(ComponentA)!);
        const a2 = entity.add(engine.obtainComponent(ComponentA)!);

        const components = entity.getAll();
        for (let i = 0; i < components.length; ++i) {
            if (i === ComponentA.id) expect(components[i]).toBeDefined();
            else expect(components[i]).toBeUndefined();
        }

        expect(entity.has(ComponentA)).toBe(true);
        expect(a1 === entity.get(ComponentA)).toBe(false);
        expect(entity.get(ComponentA)).toBe(a2);
    });

    test("getComponentByClass", () => {
        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);

        const compA = entity.add(engine.obtainComponent(ComponentA)!);
        const compB = entity.add(engine.obtainComponent(ComponentB)!);

        const retA = entity.get(ComponentA);
        const retB = entity.get(ComponentB);

        expect(retA).not.toBeUndefined();
        expect(retB).not.toBeUndefined();

        expect(retA).toBe(compA);
        expect(retB).toBe(compB);
    });

    test("requireComponentByClass", () => {
        const engine = new Engine();
        const entity = new Entity();
        engine.entities.add(entity);

        const compA = entity.add(engine.obtainComponent(ComponentA)!);
        const compB = entity.add(engine.obtainComponent(ComponentB)!);

        const retA = entity.require(ComponentA);
        const retB = entity.require(ComponentB);

        expect(retA).not.toBeUndefined();
        expect(retB).not.toBeUndefined();

        expect(retA).toBe(compA);
        expect(retB).toBe(compB);

        expect(() => entity.require(ComponentC)).toThrow();
    });
});
