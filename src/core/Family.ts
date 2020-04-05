/* eslint-disable max-classes-per-file */
import { UniqueType } from "./UniqueType";
import { Component } from "./Component";
import { Entity } from "./Entity";
import { Bits } from "../utils/Bits";
import { Constructor } from "../utils/Constructor";

function addBitsString(ss: string[], prefix: string, bits: Bits) {
    ss.push(prefix);
    ss.push(bits.getStringId());
    ss.push(";");
}

function getFamilyHash(all: Bits, one: Bits, exclude: Bits) {
    const ss: string[] = [];
    if (!all.isEmpty()) addBitsString(ss, "a:", all);
    if (!one.isEmpty()) addBitsString(ss, "o:", one);
    if (!exclude.isEmpty()) addBitsString(ss, "e:", exclude);
    return ss.join("");
}

const families: { [s: string]: Family } = {};
const familiesByIndex: Family[] = [];

/**
 * A builder pattern to create Family objects.
 * Use Family.all(), Family.one() or Family.exclude() to start
 *
 * Example usage:
 *```typescript
 *let family = Family.all(ComponentA, ComponentB).one(ComponentC, ComponentD).exclude(ComponentE).get();
 *```
 */
export class FamilyBuilder {
    private m_all = new Bits();

    private m_one = new Bits();

    private m_exclude = new Bits();

    /**
     * Resets the builder instance
     *
     * @return this for chaining
     */
    public reset() {
        this.m_all.clearAll();
        this.m_one.clearAll();
        this.m_exclude.clearAll();
        return this;
    }

    /**
     * @param clazzes Entities of the family will have to contain all of the specified components.
     * @return this for chaining
     */
    public all(...clazzes: Array<Constructor<Component>>) {
        UniqueType.getBitsForClasses(this.m_all, ...clazzes);
        return this;
    }

    /**
     * @param clazzes Entities of the family will have to contain at least one of the specified components.
     * @return this for chaining
     */
    public one(...clazzes: Array<Constructor<Component>>) {
        UniqueType.getBitsForClasses(this.m_one, ...clazzes);
        return this;
    }

    /**
     * @param clazzes Entities of the family cannot contain any of the specified components.
     * @return this for chaining
     */
    public exclude(...clazzes: Array<Constructor<Component>>) {
        UniqueType.getBitsForClasses(this.m_exclude, ...clazzes);
        return this;
    }

    /** @return A Family for the configured component types */
    public get() {
        const hash = getFamilyHash(this.m_all, this.m_one, this.m_exclude);
        let family = families[hash];
        if (!family) {
            family = new Family(this.m_all, this.m_one, this.m_exclude);
            familiesByIndex.push(family);
            families[hash] = family;
            this.m_all = new Bits();
            this.m_one = new Bits();
            this.m_exclude = new Bits();
        }
        return family;
    }
}

const builder: FamilyBuilder = new FamilyBuilder();
let nextFamilyIndex = 0;

/**
 * Represents a group of {@link Component}s. It is used to describe what Entity objects an EntitySystem should
 * process. Families can't be instantiated directly but must be accessed via a builder.
 * This is to avoid duplicate families that describe the same components
 * Start with {@link Family.all}, {@link Family.one} or {@link Family.exclude}.
 */
export class Family {
    private m_all: Bits;

    private m_one: Bits;

    private m_exclude: Bits;

    /** The unique identifier of this Family */
    public readonly index: number;

    public constructor(all: Bits, one: Bits, exclude: Bits) {
        this.index = nextFamilyIndex++;
        this.m_all = all;
        this.m_one = one;
        this.m_exclude = exclude;
    }

    /**
     * @param entity An entity
     * @return Whether the entity matches the family requirements or not
     */
    public matches(entity: Entity) {
        const entityComponentBits = entity.getComponentBits();

        if (!entityComponentBits.containsAll(this.m_all)) return false;

        if (!this.m_one.isEmpty() && !this.m_one.intersects(entityComponentBits)) return false;

        if (!this.m_exclude.isEmpty() && this.m_exclude.intersects(entityComponentBits)) return false;

        return true;
    }

    /**
     * @param clazzes Entities will have to contain all of the specified components.
     * @return A builder singleton instance to get a Family
     */
    public static all(...clazzes: Array<Constructor<Component>>) {
        return builder.reset().all(...clazzes);
    }

    /**
     * @param clazzes Entities will have to contain at least one of the specified components.
     * @return A builder singleton instance to get a Family
     */
    public static one(...clazzes: Array<Constructor<Component>>) {
        return builder.reset().one(...clazzes);
    }

    /**
     * @param clazzes Entities cannot contain any of the specified components.
     * @return A builder singleton instance to get a Family
     */
    public static exclude(...clazzes: Array<Constructor<Component>>) {
        return builder.reset().exclude(...clazzes);
    }

    /**
     * Get a family by its index.
     *
     * @param index the index of the family
     * @return The family or null if out of bounds
     */
    public static getByIndex(index: number) {
        if (index >= 0 && index < familiesByIndex.length) return familiesByIndex[index];
        return null;
    }
}
