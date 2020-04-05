import { Component } from "../core/Component";
import { Entity } from "../core/Entity";
import { Engine } from "../core/Engine";
import { simpleComponentFactory } from "./ComponentFactory";
import { EntityFactory } from "./EntityFactory";
import { ComponentBlueprint } from "./ComponentBlueprint";
import { EntityBlueprint } from "./EntityBlueprint";

interface PositionDef {
    type: "Position";
    x?: number;
    y?: number;
}

interface RenderDef {
    type: "Render";
    layer?: number;
    color?: string;
}

interface LabelDef {
    type: "Label";
    message?: string;
}

interface MarkerDef {
    type: "Marker";
}

type PossibleComponentDefs = PositionDef | RenderDef | LabelDef | MarkerDef;

const blueprintWithData: PossibleComponentDefs[] = [
    {
        type: "Position",
        x: 10.1,
        y: 11.2,
    },
    {
        type: "Render",
        layer: 42,
        color: "FF0000",
    },
    {
        type: "Label",
        message: "a full blown message",
    },
    {
        type: "Marker",
    },
];

const blueprintWithoutData: PossibleComponentDefs[] = [
    { type: "Position" },
    { type: "Render" },
    { type: "Label" },
    { type: "Marker" },
];

class PositionComponent extends Component {
    x = 0;

    y = 0;
}
class RenderComponent extends Component {
    layer = 0;

    color = "";
}
class LabelComponent extends Component {
    message = "";
}
class MarkerComponent extends Component {
    message = "";
}

function positionComponentFactory(entity: Entity, blueprint: ComponentBlueprint) {
    const comp = entity.add(new PositionComponent());
    comp.x = blueprint.getNumber("x", 1);
    comp.y = blueprint.getNumber("y", 2);
    return true;
}

function renderComponentFactory(entity: Entity, blueprint: ComponentBlueprint): boolean {
    const comp = entity.add(new RenderComponent());
    comp.layer = blueprint.getNumber("layer", 1);
    comp.color = blueprint.getString("color", "FFFFFF");
    return true;
}

function labelComponentFactory(entity: Entity, blueprint: ComponentBlueprint): boolean {
    const comp = entity.add(new LabelComponent());
    comp.message = blueprint.getString("message", "no message");
    return true;
}

function testFactoryInit(componentDefs: PossibleComponentDefs[], engine: Engine): EntityFactory {
    const factory = new EntityFactory();
    // Setup component factories
    factory.addComponentFactory("Position", positionComponentFactory);
    factory.addComponentFactory("Render", renderComponentFactory);
    factory.addComponentFactory("Label", labelComponentFactory);
    factory.addComponentFactory("Marker", simpleComponentFactory(MarkerComponent));

    const entityBlueprint = new EntityBlueprint();

    for (const componentDef of componentDefs) {
        const cb = new ComponentBlueprint(componentDef.type);
        for (const ckey of Object.keys(componentDef)) {
            cb.set(ckey, componentDef[ckey as keyof PossibleComponentDefs]);
        }
        entityBlueprint.add(cb);
    }
    factory.addEntityBlueprint("good", entityBlueprint);

    engine.setEntityFactory(factory);
    return factory;
}

function assembleGoodEntity(engine: Engine, overrides?: { [s: string]: { [s: string]: any } }): Entity {
    const entity = engine.assembleEntity("good", overrides);
    expect(entity).not.toBe(null);
    if (!entity) throw new Error();
    expect(entity.has(PositionComponent)).toBe(true);
    expect(entity.has(RenderComponent)).toBe(true);
    expect(entity.has(LabelComponent)).toBe(true);
    expect(entity.has(MarkerComponent)).toBe(true);
    return entity;
}

describe("EntityFactory", () => {
    test("test_assemble_without_entity_factory", () => {
        const engine = new Engine();
        expect(engine.assembleEntity("good")).toBe(null);
    });

    test("test_assemble_without_blueprint", () => {
        const engine = new Engine();
        testFactoryInit(blueprintWithData, engine);
        expect(engine.assembleEntity("whoops")).toBe(null);
    });

    test("test_assemble_without_component_factory", () => {
        const engine = new Engine();
        const factory = testFactoryInit(blueprintWithData, engine);

        const entityBlueprint = new EntityBlueprint();

        entityBlueprint.add(new ComponentBlueprint("Missing"));
        factory.addEntityBlueprint("missing_component", entityBlueprint);
        expect(engine.assembleEntity("missing_component")).toBe(null);
    });

    test("test_assemble_with_overrides", () => {
        const engine = new Engine();
        testFactoryInit(blueprintWithData, engine);
        const entity = assembleGoodEntity(engine, {
            Position: {
                x: 1337,
                y: 1337,
            },
        });
        expect(entity).not.toBe(null);
        const pos = entity.get(PositionComponent);
        expect(pos).not.toBe(null);
        if (pos) {
            expect(pos.x).toBe(1337);
            expect(pos.y).toBe(1337);
        }
    });

    test("test_entity_factory_with_data", () => {
        const engine = new Engine();
        testFactoryInit(blueprintWithData, engine);
        const entity = assembleGoodEntity(engine);

        const pos = entity.get(PositionComponent);
        expect(pos).not.toBe(null);
        if (!pos) return;
        expect(pos.x).toBe(10.1);
        expect(pos.y).toBe(11.2);
        const render = entity.get(RenderComponent);
        expect(render).not.toBe(null);
        if (!render) return;
        expect(render.layer).toBe(42);
        expect(render.color).toBe("FF0000");
        const label = entity.get(LabelComponent);
        expect(label).not.toBe(null);
        if (!label) return;
        expect(label.message).toBe("a full blown message");
        engine.addEntity(entity);
    });

    test("test_entity_factory_without_data", () => {
        const engine = new Engine();
        testFactoryInit(blueprintWithoutData, engine);
        const entity = assembleGoodEntity(engine);

        const pos = entity.get(PositionComponent);
        expect(pos).not.toBe(null);
        if (!pos) return;
        expect(pos.x).toBe(1);
        expect(pos.y).toBe(2);
        const render = entity.get(RenderComponent);
        expect(render).not.toBe(null);
        if (!render) return;
        expect(render.layer).toBe(1);
        expect(render.color).toBe("FFFFFF");
        const label = entity.get(LabelComponent);
        expect(label).not.toBe(null);
        if (!label) return;
        expect(label.message).toBe("no message");
        engine.addEntity(entity);
    });
});
