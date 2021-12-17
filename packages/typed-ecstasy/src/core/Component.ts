let nextComponentBit = 0;

/**
 * An interface for a constructor of a component.
 *
 * @template T The class the constructor creates.
 */
export interface ComponentConstructor<T extends Component = Component> {
    /** The constructor function. */
    new (...p: any[]): T;

    /** @returns The component bit. */
    getComponentBit(): number;
}

/**
 * An interface for a constructor of a component that doesn't need parameters.
 *
 * @template T The class the constructor creates.
 */
export interface NoArgsComponentConstructor<T extends Component = Component> {
    /** The constructor function. */
    new (): T;

    /** @returns The component bit. */
    getComponentBit(): number;
}

/**
 * Base class for all components. A Component is intended as a data holder
 * and provides data to be processed in an {@link EntitySystem}.
 */
export abstract class Component {
    /**
     * @returns The class of this component.
     */
    public getComponentClass() {
        return Object.getPrototypeOf(this).constructor;
    }

    /**
     * @returns The bit of this component.
     */
    public getComponentBit() {
        return this.getComponentClass().getComponentBit();
    }

    /**
     * @returns The bit of this component class.
     * @throws When called on Component itself rather than on a subclass.
     */
    public static getComponentBit() {
        if (this === Component)
            throw new Error("getComponentBit is not to be called on Component, only subclasses of Component!");
        const bit = nextComponentBit++;
        const getBit = () => bit;
        this.prototype.getComponentBit = getBit;
        this.getComponentBit = getBit;
        return bit;
    }

    /**
     * Check if this component matches the specified class.
     *
     * @param clazz The class to compare with.
     * @returns True if it matches.
     */
    public is(clazz: ComponentConstructor) {
        return this.getComponentBit() === clazz.getComponentBit();
    }
}
