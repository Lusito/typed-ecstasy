import { getConstructorFor, Constructor } from "../utils/Constructor";

/**
 * Base class for all components. A Component is intended as a data holder
 * and provides data to be processed in an EntitySystem.
 */
export abstract class Component {
    /**
     * @return The class of this component.
     */
    getComponentClass() {
        return getConstructorFor(this);
    }

    /**
     * Check if this component matches the specified class.
     *
     * @param clazz The class to compare with.
     * @return true if it matches.
     */
    is(clazz: Constructor<Component>) {
        return getConstructorFor(this) === clazz;
    }
}
