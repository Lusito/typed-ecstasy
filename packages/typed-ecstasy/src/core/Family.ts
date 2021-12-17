/* eslint-disable dot-notation */
/* eslint-disable max-classes-per-file */
import { ComponentConstructor } from "./Component";
import { Entity } from "./Entity";
import { Bits, ReadonlyBits } from "../utils/Bits";

function addBitsString(ss: string[], prefix: string, bits: ReadonlyBits) {
    ss.push(prefix);
    ss.push(bits.getStringId());
    ss.push(";");
}

function getFamilyHash(all: ReadonlyBits, one: ReadonlyBits, exclude: ReadonlyBits) {
    const ss: string[] = [];
    if (!all.isEmpty()) addBitsString(ss, "a:", all);
    if (!one.isEmpty()) addBitsString(ss, "o:", one);
    if (!exclude.isEmpty()) addBitsString(ss, "e:", exclude);
    return ss.join("");
}

const families: Record<string, Family> = {};
const familiesByIndex: Family[] = [];

/**
 * A builder pattern to create Family objects.
 * Use {@link Family.all}, {@link Family.one} or {@link Family.exclude} to start.
 *
 * @example
 *```typescript
 *let family = Family.all(ComponentA, ComponentB).one(ComponentC, ComponentD).exclude(ComponentE).get();
 *```
 */
export class FamilyBuilder {
    private static readonly instance = new FamilyBuilder();

    private m_all = new Bits();

    private m_one = new Bits();

    private m_exclude = new Bits();

    // eslint-disable-next-line
    private constructor() {}

    /**
     * Resets the builder instance.
     *
     * @internal
     * @returns This for chaining.
     */
    protected reset() {
        this.m_all.clearAll();
        this.m_one.clearAll();
        this.m_exclude.clearAll();
        return this;
    }

    private setBitsForClasses(destination: Bits, ...classes: ComponentConstructor[]) {
        for (const clazz of classes) {
            destination.set(clazz.getComponentBit());
        }

        return this;
    }

    /**
     * Entities of the family will have to contain all of the specified components.
     *
     * @param classes All of these classes must be on an entity for it to belong to this family.
     * @returns This for chaining.
     */
    public all(...classes: ComponentConstructor[]) {
        return this.setBitsForClasses(this.m_all, ...classes);
    }

    /**
     * Entities of the family will have to contain at least one of the specified components.
     *
     * @param classes One of these classes must be on an entity for it to belong to this family.
     * @returns This for chaining.
     */
    public one(...classes: ComponentConstructor[]) {
        return this.setBitsForClasses(this.m_one, ...classes);
    }

    /**
     * Entities of the family cannot contain any of the specified components.
     *
     * @param classes If any one of these classes is on an entity, it will not belong to this family.
     * @returns This for chaining.
     */
    public exclude(...classes: ComponentConstructor[]) {
        return this.setBitsForClasses(this.m_exclude, ...classes);
    }

    /** @returns A Family for the configured component types. */
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

const builder = FamilyBuilder["instance"];
let nextFamilyIndex = 0;

/**
 * Represents a group of {@link Component Components}. It is used to describe what Entity objects an EntitySystem should
 * process. Families can't be instantiated directly but must be accessed via a builder.
 * This is to avoid duplicate families that describe the same components
 * Start with {@link Family.all}, {@link Family.one} or {@link Family.exclude}.
 */
export class Family {
    private m_all: ReadonlyBits;

    private m_one: ReadonlyBits;

    private m_exclude: ReadonlyBits;

    /** The unique identifier of this Family. */
    public readonly index: number;

    /**
     * Use {@link Family.all}, {@link Family.one} or {@link Family.exclude} instead!
     *
     * @param all The all bits to use.
     * @param one The one bits to use.
     * @param exclude The exclude bits to use.
     * @internal
     */
    public constructor(all: ReadonlyBits, one: ReadonlyBits, exclude: ReadonlyBits) {
        this.index = nextFamilyIndex++;
        this.m_all = all;
        this.m_one = one;
        this.m_exclude = exclude;
    }

    /**
     * @param entity The entity to check.
     * @returns Whether the entity matches the family requirements or not.
     */
    public matches(entity: Entity) {
        const entityComponentBits = entity.getComponentBits();

        if (!entityComponentBits.containsAll(this.m_all)) return false;

        if (!this.m_one.isEmpty() && !this.m_one.intersects(entityComponentBits)) return false;

        if (!this.m_exclude.isEmpty() && this.m_exclude.intersects(entityComponentBits)) return false;

        return true;
    }

    /**
     * Entities of the family will have to contain all of the specified components.
     *
     * @param classes All of these classes must be on an entity for it to belong to this family.
     * @returns A builder singleton instance to get a Family.
     */
    public static all(...classes: ComponentConstructor[]) {
        return builder["reset"]().all(...classes);
    }

    /**
     * Entities of the family will have to contain at least one of the specified components.
     *
     * @param classes One of these classes must be on an entity for it to belong to this family.
     * @returns A builder singleton instance to get a Family.
     */
    public static one(...classes: ComponentConstructor[]) {
        return builder["reset"]().one(...classes);
    }

    /**
     * Entities of the family cannot contain any of the specified components.
     *
     * @param classes If any one of these classes is on an entity, it will not belong to this family.
     * @returns A builder singleton instance to get a Family.
     */
    public static exclude(...classes: ComponentConstructor[]) {
        return builder["reset"]().exclude(...classes);
    }
}
