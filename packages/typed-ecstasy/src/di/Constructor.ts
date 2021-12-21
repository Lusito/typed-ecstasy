// eslint-disable-next-line @typescript-eslint/ban-types
export type Constructor<T> = Function & { prototype: T };

export function getConstructorName(object: Constructor<unknown>): string {
    return "name" in object && object.name ? object.name : String(object);
}
