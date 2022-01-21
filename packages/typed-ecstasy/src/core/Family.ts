/* eslint-disable dot-notation */
import { ComponentClass } from "./Component";
import type { Entity } from "./Entity";

function getFamilyHash(all: readonly number[], one: readonly number[], exclude: readonly number[]) {
    return `${all.join(",")};${one.join(",")};${exclude.join(",")}`;
}

const families: Record<string, Family> = {};

/**
 * A builder pattern to create Family objects.
 * Use {@link Family.all}, {@link Family.one} or {@link Family.exclude} to start.
 *
 * @example
 *```typescript
 *let family = Family.all(ComponentA, ComponentB).one(ComponentC, ComponentD).exclude(ComponentE).get();
 *```
 */
export interface FamilyBuilder {
    /**
     * Entities of the family will have to contain all of the specified components.
     *
     * @param classes All of these component types must be on an entity for it to belong to this family.
     * @returns This for chaining.
     */
    all(...classes: ComponentClass[]): FamilyBuilder;

    /**
     * Entities of the family will have to contain at least one of the specified components.
     *
     * @param classes One of these component types must be on an entity for it to belong to this family.
     * @returns This for chaining.
     */
    one(...classes: ComponentClass[]): FamilyBuilder;

    /**
     * Entities of the family cannot contain any of the specified components.
     *
     * @param classes If any one of these component types is on an entity, it will not belong to this family.
     * @returns This for chaining.
     */
    exclude(...classes: ComponentClass[]): FamilyBuilder;

    /** @returns A Family for the configured component types. */
    get(): Family;
}

function addIdsFor(destination: number[], ...classes: ComponentClass[]) {
    for (const { id } of classes) {
        if (!destination.includes(id)) destination.push(id);
    }
}

function createBuilder() {
    const all: number[] = [];
    const one: number[] = [];
    const exclude: number[] = [];

    const builder: FamilyBuilder = {
        all(...classes) {
            addIdsFor(all, ...classes);
            return builder;
        },
        one(...classes) {
            addIdsFor(one, ...classes);
            return builder;
        },
        exclude(...classes) {
            addIdsFor(exclude, ...classes);
            return builder;
        },
        get() {
            // Sorted, so we get the same hash every time
            all.sort();
            one.sort();
            exclude.sort();
            const hash = getFamilyHash(all, one, exclude);
            let family = families[hash];
            if (!family) {
                family = new Family(all, one, exclude);
                families[hash] = family;
            }
            return family;
        },
    };
    return builder;
}

let nextFamilyIndex = 0;

/**
 * Represents a group of components. It is used to describe what Entity objects a System should
 * process. Families can't be instantiated directly but must be accessed via a builder.
 * This is to avoid duplicate families that describe the same components
 * Start with {@link Family.all}, {@link Family.one} or {@link Family.exclude}.
 */
export class Family {
    private all: readonly number[];

    private one: readonly number[];

    private exclude: readonly number[];

    /** The unique identifier of this Family. */
    public readonly index: number;

    /**
     * Use {@link Family.all}, {@link Family.one} or {@link Family.exclude} instead!
     *
     * @param all The all ids to use.
     * @param one The one ids to use.
     * @param exclude The exclude ids to use.
     * @internal
     */
    public constructor(all: readonly number[], one: readonly number[], exclude: readonly number[]) {
        this.index = nextFamilyIndex++;
        this.all = all;
        this.one = one;
        this.exclude = exclude;
    }

    /**
     * @param entity The entity to check.
     * @returns Whether the entity matches the family requirements or not.
     */
    public matches(entity: Entity) {
        const byId = entity["componentsById"];
        for (const id of this.all) {
            if (!byId[id]) return false;
        }

        for (const id of this.exclude) {
            if (byId[id]) return false;
        }

        if (this.one.length) {
            for (const id of this.one) {
                if (byId[id]) return true;
            }
            return false;
        }

        return true;
    }

    /**
     * Entities of the family will have to contain all of the specified components.
     *
     * @param classes All of these component types must be on an entity for it to belong to this family.
     * @returns A builder singleton instance to get a Family.
     */
    public static all(...classes: ComponentClass[]) {
        return createBuilder().all(...classes);
    }

    /**
     * Entities of the family will have to contain at least one of the specified components.
     *
     * @param classes One of these component types must be on an entity for it to belong to this family.
     * @returns A builder singleton instance to get a Family.
     */
    public static one(...classes: ComponentClass[]) {
        return createBuilder().one(...classes);
    }

    /**
     * Entities of the family cannot contain any of the specified components.
     *
     * @param classes If any one of these component types is on an entity, it will not belong to this family.
     * @returns A builder singleton instance to get a Family.
     */
    public static exclude(...classes: ComponentClass[]) {
        return createBuilder().exclude(...classes);
    }
}
