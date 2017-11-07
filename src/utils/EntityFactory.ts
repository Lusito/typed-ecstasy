/*******************************************************************************
 * Copyright 2011 See AUTHORS file.
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

import { EntityBlueprint } from "./Blueprint";
import { ComponentFactory } from "./ComponentFactory";
import { Entity } from "../core/Entity";

/**
 * A factory to create {@link Entity entities} from blueprints.
 */
export class EntityFactory {
	private componentFactories: { [s: string]: ComponentFactory; } = {};
	private entities: { [s: string]: EntityBlueprint; } = {};

	/**
	 * Add a component factory
	 *
	 * @param name the name used to identify a Component
	 * @param factory the factory to use
	 */
	public addComponentFactory(name: string, factory: ComponentFactory): void {
		this.componentFactories[name] = factory;
	}

	/**
	 * @param name the name used to identify the EntityBlueprint
	 * @param blueprint the blueprint
	 */
	public addEntityBlueprint(name: string, blueprint: EntityBlueprint): void {
		this.entities[name] = blueprint;
	}

	/**
	 * Add all {@link Component}s found in a blueprint to the supplied entity.
	 *
	 * @param entity the entity to add the {@link Component}s to.
	 * @param blueprintname the name used to identify the EntityBlueprint
	 * @return true on success.
	 */
	public assemble(entity: Entity, blueprintname: string, overrides?: { [s: string]: { [s: string]: any } }): boolean {
		let blueprint = this.entities[blueprintname];
		let success = false;
		if (blueprint) {
			success = true;
			for (let componentBlueprint of blueprint.components) {
				let factory = this.componentFactories[componentBlueprint.name];
				componentBlueprint.setOverrides(overrides && overrides[componentBlueprint.name]);
				if (!factory || !factory.assemble(entity, componentBlueprint)) {
					success = false;
					console.error('Could not assemble component ' + componentBlueprint.name);
				}
				componentBlueprint.setOverrides();
			}
		}
		return success;
	}
}
