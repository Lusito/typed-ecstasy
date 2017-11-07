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

import { Constructor } from "./Constructor";
import { UniqueType } from "../core/UniqueType";

/**
 * A lookup is used to store and retrieve instances bound to a specified class.
 */
export class Lookup {
    private map: { [s: string]: any } = {};

    /**
     * Store an instance of a class
     * 
     * @param clazz The class used to get the instance later.
     * @param instance The instance to store.
     */
    public put<T, I extends T>(clazz: Constructor<T>, instance: I): I {
        let type = UniqueType.getForClass(clazz);
        this.map[type.hashCode()] = instance;
        return instance;
    }

    /**
     * Get an instance of a class
     * 
     * @param clazz The class the instance was bound to.
     */
    public get<T>(clazz: Constructor<T>): T | null {
        let type = UniqueType.getForClass(clazz);
        return this.map[type.hashCode()] || null;
    }

    /**
     * Check if an instance of the specified class exists.
     * 
     * @param clazz The class the instance was bound to.
     */
    public has<T>(clazz: Constructor<T>): boolean {
        let type = UniqueType.getForClass(clazz);
        return this.map.hasOwnProperty(type.hashCode());
    }

    /**
     * Remove an instance of a class
     * 
     * @param clazz The class the instance was bound to.
     */
    public remove<T>(clazz: Constructor<T>) {
        let type = UniqueType.getForClass(clazz);
        delete this.map[type.hashCode()];
    }
}
