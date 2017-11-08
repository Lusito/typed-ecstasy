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
import { UniqueType } from "./UniqueType";
import { Component } from "./Component";
import { Entity } from "./Entity";
import { Bits } from "../utils/Bits";
import { Constructor } from "../utils/Constructor";

function addBitsString(ss: Array<string>, prefix: string, bits: Bits): void {
	ss.push(prefix);
	ss.push(bits.getStringId());
	ss.push(";");
}

function getFamilyHash(all: Bits, one: Bits, exclude: Bits): string {
	let ss: Array<string> = [];
	if (!all.isEmpty())
		addBitsString(ss, "a:", all);
	if (!one.isEmpty())
		addBitsString(ss, "o:", one);
	if (!exclude.isEmpty())
		addBitsString(ss, "e:", exclude);
	return ss.join('');
}

const families: { [s: string]: Family } = {};
const familiesByIndex: Family[] = [];

/**
 * A builder pattern to create Family objects.
 * Use Family.all(), Family.one() or Family.exclude() to start
 * 
 * Example usage:
 *```typescript
 *let family = Family.all(ComponentA, ComponentB).one(ComponentC, ComponentD).exclude(ComponentE).get();
 *```
 */
export class FamilyBuilder {
	private m_all = new Bits();
	private m_one = new Bits();
	private m_exclude = new Bits();

	/**
	 * Resets the builder instance
	 *
	 * @return this for chaining
	 */
	public reset(): FamilyBuilder {
		this.m_all.clearAll();
		this.m_one.clearAll();
		this.m_exclude.clearAll();
		return this;
	}

	/**
	 * @param clazzes Entities of the family will have to contain all of the specified components.
	 * @return this for chaining
	 */
	public all(...clazzes: Constructor<Component>[]): FamilyBuilder {
		UniqueType.getBitsForClasses(this.m_all, ...clazzes);
		return this;
	}

	/**
	 * @param clazzes Entities of the family will have to contain at least one of the specified components.
	 * @return this for chaining
	 */
	public one(...clazzes: Constructor<Component>[]): FamilyBuilder {
		UniqueType.getBitsForClasses(this.m_one, ...clazzes);
		return this;
	}

	/**
	 * @param clazzes Entities of the family cannot contain any of the specified components.
	 * @return this for chaining
	 */
	public exclude(...clazzes: Constructor<Component>[]): FamilyBuilder {
		UniqueType.getBitsForClasses(this.m_exclude, ...clazzes);
		return this;
	}

	/** @return A Family for the configured component types */
	public get(): Family {
		let hash = getFamilyHash(this.m_all, this.m_one, this.m_exclude);
		let family = families[hash];
		if (!family) {
			family = new FamilyImpl(this.m_all, this.m_one, this.m_exclude);
			familiesByIndex.push(family);
			families[hash] = family;
			this.m_all = new Bits();
			this.m_one = new Bits();
			this.m_exclude = new Bits();
		}
		return family;
	}
}

let builder: FamilyBuilder = new FamilyBuilder();
let familyTypes = 0;

/**
 * Represents a group of {@link Component}s. It is used to describe what Entity objects an EntitySystem should
 * process. Families can't be instantiated directly but must be accessed via a builder.
 * This is to avoid duplicate families that describe the same components
 * Start with {@link Family.all}, {@link Family.one} or {@link Family.exclude}.
 */
export abstract class Family {
	/** The unique identifier of this Family */
	public readonly uniqueType: UniqueType;
	
	public constructor() {
		this.uniqueType = new UniqueType(familyTypes++, 'Family');
	}

	/**
	 * @param entity An entity
	 * @return Whether the entity matches the family requirements or not
	 */
	public abstract matches(entity: Entity): boolean;
	
	/**
	 * @param clazzes Entities will have to contain all of the specified components.
	 * @return A builder singleton instance to get a Family
	 */
	public static all(...clazzes: Constructor<Component>[]): FamilyBuilder {
		return builder.reset().all(...clazzes);
	}

	/**
	 * @param clazzes Entities will have to contain at least one of the specified components.
	 * @return A builder singleton instance to get a Family
	 */
	public static one(...clazzes: Constructor<Component>[]): FamilyBuilder {
		return builder.reset().one(...clazzes);
	}

	/**
	 * @param clazzes Entities cannot contain any of the specified components.
	 * @return A builder singleton instance to get a Family
	 */
	public static exclude(...clazzes: Constructor<Component>[]): FamilyBuilder {
		return builder.reset().exclude(...clazzes);
	}

	/**
	 * Get a family by its index.
	 * 
	 * @param index the index of the family
	 * @return The family or null if out of bounds
	 */
	public static getByIndex(index: number): Family | null {
		if (index >= 0 && index < familiesByIndex.length)
			return familiesByIndex[index];
		return null;
	}
}

class FamilyImpl extends Family {
	private m_all: Bits;
	private m_one: Bits;
	private m_exclude: Bits;

	public constructor(all: Bits, one: Bits, exclude: Bits) {
		super();
		this.m_all = all;
		this.m_one = one;
		this.m_exclude = exclude;
	}

	public matches(entity: Entity): boolean {
		let entityComponentBits = entity.getComponentBits();

		if (!entityComponentBits.containsAll(this.m_all))
			return false;

		if (!this.m_one.isEmpty() && !this.m_one.intersects(entityComponentBits))
			return false;

		if (!this.m_exclude.isEmpty() && this.m_exclude.intersects(entityComponentBits))
			return false;

		return true;
	}
}
