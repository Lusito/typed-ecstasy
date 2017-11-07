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

const emptyOverrides = {};

/**
 * Stores the name of a component and key/value pairs to construct the component.
 * See EntityFactory.
 */
export class ComponentBlueprint {
	/** The name of this blueprint */
	public readonly name: string;
	private overrides: { [s: string]: any } = emptyOverrides;
	private values: { [s: string]: string | boolean | number | null; } = {};

	/**
	 * Creates a new blueprint with the specified component name
	 *
	 * @param name the name of the component.
	 */
	public constructor(name: string) {
		this.name = name;
	}

	/**
	 * Set the overrides map
	 * 
	 * @param overrides the overrides to use on the next get* calls
	 */
	public setOverrides(overrides?: { [s: string]: any }): void {
		this.overrides = overrides || emptyOverrides;
	}

	/**
	 * Set a key/value pair
	 *
	 * @param key the key
	 * @param value the value
	 */
	public set(key: string, value: any): void {
		this.values[key] = value;
	}

	/**
	 * Get a boolean value
	 *
	 * @param key the key
	 * @param defaultValue the value to return if no value exists for key.
	 * @return The corresponding value or defaultValue if none exists.
	 */
	public getBool(key: string, defaultValue: boolean): boolean {
		if (this.overrides.hasOwnProperty(key)) {
			let value = this.overrides[key];
			if (value === true || value === false)
				return value;
		}
		if (this.values.hasOwnProperty(key)) {
			let value = this.values[key];
			if (value === true || value === false)
				return value;
		}
		return defaultValue;
	}

	/**
	 * Get an integer value
	 *
	 * @param key the key
	 * @param defaultValue the value to return if no value exists for key.
	 * @return The corresponding value or defaultValue if none exists.
	 */
	public getNumber(key: string, defaultValue: number): number {
		if (this.overrides.hasOwnProperty(key)) {
			let value = this.overrides[key];
			if (typeof (value) === "number")
				return value;
		}
		if (this.values.hasOwnProperty(key)) {
			let value = this.values[key];
			if (typeof (value) === "number")
				return value;
		}
		return defaultValue;
	}

	/**
	 * Get a string value
	 *
	 * @param key the key
	 * @param defaultValue the value to return if no value exists for key.
	 * @return The corresponding value or defaultValue if none exists.
	 */
	public getString(key: string, defaultValue: string): string {
		if (this.overrides.hasOwnProperty(key)) {
			let value = this.overrides[key];
			if (typeof (value) === "string")
				return value;
		}
		if (this.values.hasOwnProperty(key)) {
			let value = this.values[key];
			if (typeof (value) === "string")
				return value;
		}
		return defaultValue;
	}

	/**
	 * Get any type of value
	 *
	 * @param key the key
	 * @param defaultValue the value to return if no value exists for key.
	 * @return The corresponding value or defaultValue if none exists.
	 */
	public getAny(key: string, defaultValue: any): any {
		if (this.overrides.hasOwnProperty(key))
			return this.overrides[key];
		if (this.values.hasOwnProperty(key))
			return this.values[key];
		return defaultValue;
	}
}

/**
 * Stores a list of {@link ComponentBlueprint}s needed to construct an Entity.
 * See EntityFactory.
 */
export class EntityBlueprint {
	/** The component blueprints to use */
	public readonly components: ComponentBlueprint[] = [];

	/** @param blueprint shared_ptr to a ComponentBlueprint. */
	public add(blueprint: ComponentBlueprint): void {
		this.components.push(blueprint);
	}
}
