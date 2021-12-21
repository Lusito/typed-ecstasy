import type { Constructor } from "./types";

/**
 * @param name A descriptive name.
 * @returns A new unique Symbol value.
 */
export function InjectSymbol<T>(name: string) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const value = { [name]() {} };
    return value[name] as unknown as Constructor<T>;
}
