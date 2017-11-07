/*******************************************************************************
 * Copyright 2014 See AUTHORS file.
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

let classCounters: { [s: string]: number } = {};

/**
 * Uniquely identifies a sub-class. It assigns them an index which is used internally for fast comparison and
 * retrieval. UniqueType is a package protected class. You cannot instantiate a UniqueType.
 * They can only be accessed via {@link #getIndexForClass(clazz)}. Each class will always
 * return the same instance of UniqueType.
 */
export class UniqueType {
	private readonly group: string;
	private readonly index: number;

	public constructor(index: number, group: string) {
		this.index = index;
		this.group = group;
	}

	/** @return This UniqueType's group */
	public getGroup(): string {
		return this.group;
	}

	/** @return This UniqueType's unique index */
	public getIndex(): number {
		return this.index;
	}

	/**
	 * @param clazz The class constructor
	 * @return A UniqueType matching the Class
	 */
	public static getForInstance(inst: {}): UniqueType {
		return UniqueType.getForClass(Constructor.getFor(inst));
	}

	/**
	 * @param clazz The class constructor
	 * @return A UniqueType matching the Class
	 */
	private static generateFor(clazz: Constructor<{}>): UniqueType {
		let baseClassName = Constructor.getBaseClass(clazz).name;
		if (!baseClassName)
			throw "Could not get base class for " + clazz.toString();
		if (!classCounters.hasOwnProperty(baseClassName))
			classCounters[baseClassName] = 0;
		let index = classCounters[baseClassName]++;
		return clazz.__uniqueType = new UniqueType(index, baseClassName);
	}

	/**
	 * @param clazz The class constructor
	 * @return A UniqueType matching the Class
	 */
	public static getForClass(clazz: Constructor<{}>): UniqueType {
		return clazz && (clazz.__uniqueType || UniqueType.generateFor(clazz));
	}

	/**
	 * @param clazzes list of class constructors
	 * @return Bits representing the collection of classes for quick comparison and matching.
	 */
	public static getBitsForClasses(destination: Bits, ...clazzes: Constructor<{}>[]): Bits {
		for (let clazz of clazzes) {
			destination.set(UniqueType.getForClass(clazz).getIndex());
		}

		return destination;
	}

	/** @return a hashcode to identify this type */
	public hashCode(): string {
		return this.group + this.index;
	}

	/**
	 * Compare with another type.
	 * 
	 * @param other the other type
	 * @return true if the types are equal.
	 */
	public equals(other: UniqueType): boolean {
		if (this === other) return true;
		if (this.group !== other.group) return false;
		return this.index === other.index;
	}
}
