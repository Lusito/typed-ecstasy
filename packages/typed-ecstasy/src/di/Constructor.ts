// eslint-disable-next-line @typescript-eslint/ban-types
export type Constructor<T> = Function & { prototype: T };

/**
 * @param constructor The constructor to get a name for.
 * @returns The name of the constructor.
 */
export function getConstructorName(constructor: Constructor<unknown>): string {
    return "name" in constructor && constructor.name ? constructor.name : String(constructor);
}
