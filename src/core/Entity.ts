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

import { Bits } from "../utils/Bits";
import { Constructor } from "../utils/Constructor";
import { Component } from "./Component";
import { UniqueType } from "./UniqueType";
import { Engine } from "./Engine";

/**
 * Simple containers of {@link Component Components} that give them "data".
 * The component's data is then processed by {@link EntitySystem}s.
 */
export class Entity {
	/** A flag that can be used to bit mask this entity. Up to the user to manage. */
	public flags: number = 0;

	private uuid: number = 0;
	private scheduledForRemoval: boolean = false;

	private componentsByType: { [s: string]: Component } = {};
	private components: Component[] = [];
	private readonly componentBits = new Bits();
	private readonly familyBits = new Bits();
	private engine: Engine | null = null;


	/** @return The Entity's unique id. */
	public getId(): number { return this.uuid; }

	/** @return true if the entity is valid (added to the engine). */
	public isValid(): boolean { return this.uuid > 0; }

	/** @return true if the entity is scheduled to be removed */
	public isScheduledForRemoval(): boolean { return this.scheduledForRemoval; }

	/** Remove this entity from its engine */
	public destroy(): void {
		if (this.engine)
			this.engine.removeEntity(this);
	}

	/**
	 * Add a component. This will be freed on removal. Prefer add() instead
	 *
	 * @typeparam T The component class
	 * @param component the component to add
	 * @return The added component
	 */
	public add<T extends Component>(component: T): T {
		if (this.addInternal(component) && this.engine)
			this.engine.requestFamilyUpdate(this);
		return component;
	}

	/**
	 * Removes the Component of the specified type. Since there is only ever one Component of one type, we don't
	 * need an instance reference.
	 *
	 * @param clazz The Component class
	 */
	public remove(clazz: Constructor<Component>): void {
		let type = UniqueType.getForClass(clazz);
		if (this.removeInternal(type) && this.engine)
			this.engine.requestFamilyUpdate(this);
	}

	/** Removes all the {@link Component}s from the Entity. */
	public removeAll(): void {
		if (this.removeAllInternal() && this.engine)
			this.engine.requestFamilyUpdate(this);
	}

	/** @return A list with all the {@link Component}s of this Entity. */
	public getAll(): Component[] {
		return this.components;
	}

	/**
	 * Retrieve a Component from this Entity by class.
	 *
	 * @typeparam T The component class
	 * @param clazz The Component class
	 * @return The instance of the specified Component attached to this Entity, or null if no such Component exists.
	 */
	public get<T extends Component>(clazz: Constructor<T>): T | null {
		return <T>(this.getComponent(UniqueType.getForClass(clazz)));
	}

	/**
	 * @param clazz The Component class
	 * @return Whether or not the Entity has a Component for the specified class.
	 */
	public has(clazz: Constructor<Component>): boolean {
		return this.componentBits.get(UniqueType.getForClass(clazz).getIndex());
	}

	/** @return The Component object for the specified class, null if the Entity does not have any components for that class. */
	public getComponent(uniqueType: UniqueType): Component | null {
		let index = uniqueType.getIndex();
		return this.componentsByType[index] || null;
	}

	private addInternal(component: Component): boolean {
		let type = UniqueType.getForInstance(component);
		let oldComponent = this.getComponent(type);
		if (component === oldComponent)
			return false;

		if (oldComponent != null)
			this.removeInternal(type);

		let typeIndex = type.getIndex();

		this.componentsByType[typeIndex] = component;
		this.components.push(component);

		this.componentBits.set(typeIndex);
		return true;
	}

	private removeInternal(type: UniqueType): Component | null {
		let index = type.getIndex();
		let component = this.componentsByType[index];
		if (component) {
			delete this.componentsByType[index];

			let index2 = this.components.indexOf(component);
			this.components.splice(index2, 1);
			this.componentBits.clear(index);

			// component.onDestruct();
		}
		return component;
	}

	private removeAllInternal(): boolean {
		if (this.components.length) {
			while (this.components.length)
				this.removeInternal(UniqueType.getForInstance(this.components[0]));
			return true;
		}
		return false;
	}

	/** @return This Entity's Component bits, describing all the {@link Component}s it contains. */
	public getComponentBits(): Bits {
		return this.componentBits;
	}

	/** @return This Entity's Family bits, describing all the {@link EntitySystem}s it currently is being processed by. */
	public getFamilyBits(): Bits {
		return this.familyBits;
	}
}
