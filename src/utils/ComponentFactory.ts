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

import { ComponentBlueprint } from "./Blueprint";
import { Constructor } from "./Constructor";
import { Entity } from "../core/Entity";
import { Component } from "../core/Component";

/**
 * Component factory interface. Used to construct {@link Component}s from {@link ComponentBlueprint}s.
 */
export abstract class ComponentFactory {
	/**
	 * Create a Component based on the blueprint and add it to the Entity.
	 *
	 * @param entity the Entity to add the Component to.
	 * @param blueprint the blueprint
	 * @return true on success.
	 */
	public abstract assemble(entity: Entity, blueprint: ComponentBlueprint): boolean;
}

/**
 * A template ComponentFactory implementation for simple components
 * which don't need to read data from the blueprint.
 */
export class SimpleComponentFactory extends ComponentFactory {
	private componentClass: Constructor<Component>;

	/** Default constructor */
	public constructor(componentClass: Constructor<Component>) {
		super();
		this.componentClass = componentClass;
	}

	/**
	 * Assemble a component for an entity.
	 * 
	 * @param entity the entity to add the component to
	 * @param blueprint the blueprint will be ignored
	 */
	public assemble(entity: Entity, blueprint: ComponentBlueprint): boolean {
		return !!entity.add(new this.componentClass());
	}
}
