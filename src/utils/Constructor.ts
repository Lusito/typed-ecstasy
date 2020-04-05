import type { UniqueType } from "../core/UniqueType";

/**
 * An interface for a constructor of a class.
 *
 * @typeparam T The class the constructor creates
 */
export interface Constructor<T> {
    /** The constructor function */
    new (...p: any[]): T;
    /** The name of the constructor */
    name?: string;
    /** The UniqueType of the class, if assigned */
    __uniqueType?: UniqueType;
}

/**
 * Get the level of a class, i.e. how many parent classes it has.
 *
 * @param clazz The class to inspect
 */
export function getClassLevel(clazz: Constructor<{}>) {
    let count = 0;
    while (clazz) {
        clazz = Object.getPrototypeOf(clazz);
        count++;
    }
    return count - 3;
}

/**
 * Get the parent class by going down the specified number of levels.
 *
 * @param clazz The class to use as a starting point.
 * @param level The number of levels to go down.
 * @return The nth-level parent class
 */
export function getParentClass(clazz: Constructor<{}>, level: number): Constructor<{}> {
    while (level > 0) {
        clazz = Object.getPrototypeOf(clazz);
        level--;
    }
    return clazz;
}

/**
 * Get the constructor for a specified instance
 *
 * @param inst the instance to get the constructor for
 * @return the constructor.
 */
export function getConstructorFor(inst: {}): Constructor<{}> {
    return Object.getPrototypeOf(inst).constructor;
}
