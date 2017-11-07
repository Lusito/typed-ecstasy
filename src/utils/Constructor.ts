
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
