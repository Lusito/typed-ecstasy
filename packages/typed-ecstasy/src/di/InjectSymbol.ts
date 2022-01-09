import type { Constructor } from "./Constructor";

const symbols: Record<string, Constructor<unknown>> = {};

/**
 * @param id A human readable, unique id. This needs to be unique in your application.
 * @returns A new InjectSymbol you can use for manually setting injectable dependencies.
 *          This will always return the same value for the same input.
 */
export function InjectSymbol<T>(id: string): Constructor<T> {
    let constructor = symbols[id];
    if (!constructor) {
        // Just a weird way to create a dynamically named function
        const value = {
            [id]() {
                throw new Error("InjectSymbols are not meant to be called!");
            },
        };
        constructor = value[id];
        symbols[id] = constructor;
    }
    return constructor;
}
