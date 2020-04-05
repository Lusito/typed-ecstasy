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
     * @typeparam TBase The class used to get the instance later.
     * @typeparam TExtended The class of the instance.
     * @param clazz The class used to get the instance later.
     * @param instance The instance to store.
     */
    public put<TBase, TExtended extends TBase>(clazz: Constructor<TBase>, instance: TExtended) {
        const type = UniqueType.getForClass(clazz);
        this.map[type.hashCode()] = instance;
        return instance;
    }

    /**
     * Get an instance of a class
     *
     * @typeparam T The class the instance was bound to.
     * @param clazz The class the instance was bound to.
     */
    public get<T>(clazz: Constructor<T>): T | null {
        const type = UniqueType.getForClass(clazz);
        return this.map[type.hashCode()] || null;
    }

    /**
     * Check if an instance of the specified class exists.
     *
     * @typeparam T The class the instance was bound to.
     * @param clazz The class the instance was bound to.
     */
    public has<T>(clazz: Constructor<T>) {
        const type = UniqueType.getForClass(clazz);
        return type.hashCode() in this.map;
    }

    /**
     * Remove an instance of a class
     *
     * @typeparam T The class the instance was bound to.
     * @param clazz The class the instance was bound to.
     */
    public remove<T>(clazz: Constructor<T>) {
        const type = UniqueType.getForClass(clazz);
        delete this.map[type.hashCode()];
    }
}
