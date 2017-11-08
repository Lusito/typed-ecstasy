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

import { UniqueType } from "../core/UniqueType";

/**
 * An interface for a constructor of a class.
 * 
 * @typeparam T The class the constructor creates
 */
export interface Constructor<T> {
    /** The constructor function */
    new(...p: any[]): T;
    /** The name of the constructor */
    name?: string;
    /** The UniqueType of the class, if assigned */
    __uniqueType?: UniqueType;
}

export namespace Constructor {
    /**
     * Get the lowest constructor in a class hierarchy.
     * 
     * @param clazz The class to use as a starting point.
     * @return The lowest constructor in the class hierarchy
     */
    export function getBaseClass(clazz: Constructor<{}>): Constructor<{}> {
        let base = Object.getPrototypeOf(clazz);
        while (base.name) {
            clazz = base;
            base = Object.getPrototypeOf(clazz);
        }
        return clazz;
    }

    /**
     * Get the constructor for a specified instance
     * 
     * @param inst the instance to get the constructor for
     * @return the constructor.
     */
    export function getFor(inst: {}): Constructor<{}> {
        return Object.getPrototypeOf(inst).constructor;
    }
}
