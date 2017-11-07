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
import { Component } from "../../src/core/Component";
import { Entity } from "../../src/core/Entity";
import { Engine } from "../../src/core/Engine";
import { Family } from "../../src/core/Family";
import { EntitySystem } from "../../src/core/EntitySystem";

class EntityRemoverSystem extends EntitySystem {
	entity: Entity;
	public constructor(entity: Entity) { super(); this.entity = entity; }

	public update(deltaTime: number): void {
		let engine = this.getEngine();
		if (engine)
			engine.removeEntity(this.entity);
	}
}

class PositionComponent extends Component { }

@suite export class EntityListenerTests {

	@test add_entity_listener_family_remove() {
		let engine = new Engine();

		let e = engine.createEntity();
		e.add(new PositionComponent());
		engine.addEntity(e);

		let signal = engine.getEntityRemovedSignal(Family.all(PositionComponent).get());
		signal.connect((entity) => {
			engine.addEntity(engine.createEntity());
		});

		engine.removeEntity(e);
	}

	@test addEntityListenerFamilyAdd() {
		let engine = new Engine();

		let e = engine.createEntity();
		e.add(new PositionComponent());

		let signal = engine.getEntityAddedSignal(Family.all(PositionComponent).get());
		let ref = signal.connect((e) => engine.addEntity(engine.createEntity()));

		engine.addEntity(e);
		ref.disconnect();
		engine.removeAllEntities();
	}

	@test addEntityListenerNoFamilyRemove() {
		let engine = new Engine();

		let e = engine.createEntity();
		e.add(new PositionComponent());
		engine.addEntity(e);
		let family = Family.all(PositionComponent).get();
		let signal = engine.getEntityRemovedSignal(family);
		let ref = signal.connect((entity) => {
			if (family.matches(entity))
				engine.addEntity(engine.createEntity());
		});

		engine.removeEntity(e);
		ref.disconnect();
	}

	@test addEntityListenerNoFamilyAdd() {
		let engine = new Engine();

		let e = engine.createEntity();
		e.add(new PositionComponent());

		let family = Family.all(PositionComponent).get();
		let signal = engine.getEntityAddedSignal(family);
		signal.connect((entity) => {
			if (family.matches(entity))
				engine.addEntity(engine.createEntity());
		});

		engine.addEntity(e);
	}

	@test remove_entity_during_entity_removal() {
		let engine = new Engine();

		let e1 = engine.createEntity();
		let e2 = engine.createEntity();
		engine.addEntity(e1);
		engine.addEntity(e2);

		engine.addSystem(new EntityRemoverSystem(e1));

		engine.entityRemoved.connect((entity) => {
			if (entity == e1)
				engine.removeEntity(e2);
		});
		engine.update(0.16);
	}
}
