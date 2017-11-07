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
import { Constructor } from "../utils/Constructor";

/**
 * Base class for all components. A Component is intended as a data holder
 * and provides data to be processed in an EntitySystem.
 */
export class Component {
    constructor() {
        (this as any); //fixme: bug in istanbul
    }

    /**
     * @return The class of this component.
     */
    getComponentClass() {
        return Constructor.getFor(this);
    }

    /**
     * Check if this component matches the specified class.
     * 
     * @param clazz The class to compare with.
     * @return true if it matches.
     */
    is(clazz: Constructor<Component>): boolean {
        return Constructor.getFor(this) === clazz;
    }
}
