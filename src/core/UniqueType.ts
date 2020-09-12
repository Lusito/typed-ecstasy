import { Bits } from "../utils/Bits";
import { Constructor, getConstructorFor, getClassLevel, getParentClass } from "../utils/Constructor";

const classCounters = [0];

/**
 * Uniquely identifies a sub-class. It assigns them an index which is used internally for fast comparison and
 * retrieval. UniqueType is a package protected class. You cannot instantiate a UniqueType.
 * They can only be accessed via {@link #getIndexForClass(clazz)}. Each class will always
 * return the same instance of UniqueType.
 */
export class UniqueType {
    private readonly baseIndex: number;

    private readonly index: number;

    private readonly level: number;

    public constructor(index: number, baseIndex: number, level: number) {
        this.index = index;
        this.baseIndex = baseIndex;
        this.level = level;
    }

    /** @return This UniqueType's base class index (-1 if no base-class) */
    public getBaseIndex() {
        return this.baseIndex;
    }

    /** @return This UniqueType's unique index */
    public getIndex() {
        return this.index;
    }

    /**
     * @param inst A class instance
     * @return A UniqueType matching the Class
     */
    public static getForInstance(inst: unknown) {
        return UniqueType.getForClass(getConstructorFor(inst));
    }

    /**
     * @param clazz The class constructor
     * @return A UniqueType matching the Class
     */
    public static getForClass(clazz: Constructor<unknown>): UniqueType {
        // eslint-disable-next-line no-underscore-dangle
        let type = clazz.__uniqueType;
        const level = getClassLevel(clazz);
        if (!type || type.level !== level) {
            if (!type && level === 0) {
                // Already top-most class
                const index = classCounters.length;
                classCounters.push(0);
                type = new UniqueType(index, -1, level);
            } else {
                const base = getParentClass(clazz, level);
                const baseType = UniqueType.getForClass(base);
                const baseIndex = baseType.getIndex();
                const index = classCounters[baseIndex]++;
                type = new UniqueType(index, baseIndex, level);
            }
            // eslint-disable-next-line no-underscore-dangle
            clazz.__uniqueType = type;
        }
        return type;
    }

    /**
     * @param clazzes list of class constructors
     * @return Bits representing the collection of classes for quick comparison and matching.
     */
    public static getBitsForClasses(destination: Bits, ...clazzes: Array<Constructor<unknown>>) {
        for (const clazz of clazzes) {
            destination.set(UniqueType.getForClass(clazz).getIndex());
        }

        return destination;
    }

    /** @return a hashcode to identify this type */
    public hashCode() {
        return `${this.baseIndex}/${this.index}`;
    }

    /**
     * Compare with another type.
     *
     * @param other the other type
     * @return true if the types are equal.
     */
    public equals(other: UniqueType) {
        if (this === other) return true;
        if (this.baseIndex !== other.baseIndex) return false;
        return this.index === other.index;
    }
}
