/* eslint-disable dot-notation */
import { Entity } from "./Entity";
import { ComponentType } from "./Component";

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
     * @param types All of these component types must be on an entity for it to belong to this family.
     * @returns This for chaining.
     */
    all: (...types: ComponentType[]) => FamilyBuilder;

    /**
     * Entities of the family will have to contain at least one of the specified components.
     *
     * @param types One of these component types must be on an entity for it to belong to this family.
     * @returns This for chaining.
     */
    one: (...types: ComponentType[]) => FamilyBuilder;

    /**
     * Entities of the family cannot contain any of the specified components.
     *
     * @param types If any one of these component types is on an entity, it will not belong to this family.
     * @returns This for chaining.
     */
    exclude: (...types: ComponentType[]) => FamilyBuilder;

    /** @returns A Family for the configured component types. */
    get: () => Family;
}

function addIdsForTypes(destination: number[], ...types: ComponentType[]) {
    for (const { id } of types) {
        if (!destination.includes(id)) destination.push(id);
    }
}

function createBuilder() {
    const all: number[] = [];
    const one: number[] = [];
    const exclude: number[] = [];

    const builder: FamilyBuilder = {
        all(...types) {
            addIdsForTypes(all, ...types);
            return builder;
        },
        one(...types) {
            addIdsForTypes(one, ...types);
            return builder;
        },
        exclude(...types) {
            addIdsForTypes(exclude, ...types);
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
     * @param types All of these component types must be on an entity for it to belong to this family.
     * @returns A builder singleton instance to get a Family.
     */
    public static all(...types: ComponentType[]) {
        return createBuilder().all(...types);
    }

    /**
     * Entities of the family will have to contain at least one of the specified components.
     *
     * @param types One of these component types must be on an entity for it to belong to this family.
     * @returns A builder singleton instance to get a Family.
     */
    public static one(...types: ComponentType[]) {
        return createBuilder().one(...types);
    }

    /**
     * Entities of the family cannot contain any of the specified components.
     *
     * @param types If any one of these component types is on an entity, it will not belong to this family.
     * @returns A builder singleton instance to get a Family.
     */
    public static exclude(...types: ComponentType[]) {
        return createBuilder().exclude(...types);
    }
}
