/*******************************************************************************
 * Copyright 2015 See AUTHORS file.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
import { suite, test } from "mocha-typescript";
import { assert } from "chai";
import { Component } from "../../src/core/Component";
import { Entity } from "../../src/core/Entity";
import { Engine } from "../../src/core/Engine";
import { ComponentFactory, SimpleComponentFactory } from "../../src/utils/ComponentFactory";
import { EntityFactory } from "../../src/utils/EntityFactory";
import { ComponentBlueprint, EntityBlueprint } from "../../src/utils/Blueprint";

interface PositionDef {
	type: "Position",
	x?: number,
	y?: number
}

interface RenderDef {
	type: "Render",
	layer?: number,
	color?: string
}

interface LabelDef {
	type: "Label",
	message?: string
}

interface MarkerDef {
	type: "Marker"
}

export type PossibleComponentDefs =
	PositionDef
	| RenderDef
	| LabelDef
	| MarkerDef;

let blueprintWithData: PossibleComponentDefs[] = [
	{
		type: "Position",
		x: 10.1,
		y: 11.2
	}, {
		type: "Render",
		layer: 42,
		color: "FF0000"
	}, {
		type: "Label",
		message: "a full blown message"
	}, {
		type: "Marker"
	}
];

let blueprintWithoutData: PossibleComponentDefs[] = [
	{ type: "Position" },
	{ type: "Render" },
	{ type: "Label" },
	{ type: "Marker" }
];


class PositionComponent extends Component {
	x = 0;
	y = 0;
}
class RenderComponent extends Component {
	layer = 0;
	color: string;
}
class LabelComponent extends Component {
	message: string;
}
class MarkerComponent extends Component {
	message: string;
}

class PositionComponentFactory extends ComponentFactory {
	public assemble(entity: Entity, blueprint: ComponentBlueprint): boolean {
		let comp = entity.add(new PositionComponent());
		comp.x = blueprint.getNumber("x", 1);
		comp.y = blueprint.getNumber("y", 2);
		return true;
	}
}
class RenderComponentFactory extends ComponentFactory {
	public assemble(entity: Entity, blueprint: ComponentBlueprint): boolean {
		let comp = entity.add(new RenderComponent());
		comp.layer = blueprint.getNumber("layer", 1);
		comp.color = blueprint.getString("color", "FFFFFF");
		return true;
	}
}
class LabelComponentFactory extends ComponentFactory {
	public assemble(entity: Entity, blueprint: ComponentBlueprint): boolean {
		let comp = entity.add(new LabelComponent());
		comp.message = blueprint.getString("message", "no message");
		return true;
	}
}

function testFactoryInit(componentDefs: PossibleComponentDefs[], engine: Engine): EntityFactory {
	assert.isOk(componentDefs);

	let factory = new EntityFactory();
	// Setup component factories
	factory.addComponentFactory("Position", new PositionComponentFactory());
	factory.addComponentFactory("Render", new RenderComponentFactory());
	factory.addComponentFactory("Label", new LabelComponentFactory());
	factory.addComponentFactory("Marker", new SimpleComponentFactory(MarkerComponent));

	let entityBlueprint = new EntityBlueprint();

	for (let componentDef of componentDefs) {
		let cb = new ComponentBlueprint(componentDef.type);
		for (let ckey in componentDef) {
			cb.set(ckey, (<any>componentDef)[ckey]);
		}
		entityBlueprint.add(cb);
	}
	factory.addEntityBlueprint("good", entityBlueprint);

	engine.setEntityFactory(factory);
	return factory;
}

function assembleGoodEntity(engine: Engine, overrides?: { [s: string]: { [s: string]: any } }): Entity {
	let entity = engine.assembleEntity("good", overrides);
	assert.notStrictEqual(entity, null);
	if (!entity)
		throw "";
	assert.isTrue(entity.has(PositionComponent));
	assert.isTrue(entity.has(RenderComponent));
	assert.isTrue(entity.has(LabelComponent));
	assert.isTrue(entity.has(MarkerComponent));
	return entity;
}

@suite export class EntityFactoryTests {

	@test test_assemble_without_entity_factory() {
		let engine = new Engine();
		assert.isNull(engine.assembleEntity("good"));
	}

	@test test_assemble_without_blueprint() {
		let engine = new Engine();
		testFactoryInit(blueprintWithData, engine);
		assert.isNull(engine.assembleEntity("whoops"));
	}

	@test test_assemble_without_component_factory() {
		let engine = new Engine();
		let factory = testFactoryInit(blueprintWithData, engine);

		let entityBlueprint = new EntityBlueprint();

		entityBlueprint.add(new ComponentBlueprint("Missing"));
		factory.addEntityBlueprint("missing_component", entityBlueprint);
		assert.isNull(engine.assembleEntity("missing_component"));
	}

	@test test_assemble_with_overrides() {
		let engine = new Engine();
		testFactoryInit(blueprintWithData, engine);
		let entity = assembleGoodEntity(engine, {
			Position: {
				x: 1337,
				y: 1337
			}
		});
		assert.isNotNull(entity);
		let pos = entity.get(PositionComponent);
		assert.isNotNull(pos);
		if (pos) {
			assert.strictEqual(pos.x, 1337);
			assert.strictEqual(pos.y, 1337);
		}
	}

	@test test_entity_factory_with_data() {
		let engine = new Engine();
		testFactoryInit(blueprintWithData, engine);
		let entity = assembleGoodEntity(engine);

		let pos = entity.get(PositionComponent);
		assert.isNotNull(pos);
		if (!pos) return;
		assert.strictEqual(pos.x, 10.1);
		assert.strictEqual(pos.y, 11.2);
		let render = entity.get(RenderComponent);
		assert.isNotNull(render);
		if (!render) return;
		assert.strictEqual(render.layer, 42);
		assert.strictEqual(render.color, "FF0000");
		let label = entity.get(LabelComponent);
		assert.isNotNull(label);
		if (!label) return;
		assert.strictEqual(label.message, "a full blown message");
		engine.addEntity(entity);
	}

	@test test_entity_factory_without_data() {
		let engine = new Engine();
		testFactoryInit(blueprintWithoutData, engine);
		let entity = assembleGoodEntity(engine);

		let pos = entity.get(PositionComponent);
		assert.isNotNull(pos);
		if (!pos) return;
		assert.strictEqual(pos.x, 1);
		assert.strictEqual(pos.y, 2);
		let render = entity.get(RenderComponent);
		assert.isNotNull(render);
		if (!render) return;
		assert.strictEqual(render.layer, 1);
		assert.strictEqual(render.color, "FFFFFF");
		let label = entity.get(LabelComponent);
		assert.isNotNull(label);
		if (!label) return;
		assert.strictEqual(label.message, "no message");
		engine.addEntity(entity);
	}
}
