import { declareComponent, PartialEntityConfig } from "typed-ecstasy";

import { GameSound, GameSoundKey, GameSounds } from "../services/AssetService";

// First of all, we need the component data type. This is what you will interact with in your entity systems.
export type SoundData = {
    create?: GameSound;
    remove?: GameSound;
    hit?: GameSound;
};

// Then we need a configuration type, i.e. the data that is needed to assemble your entity correctly
// To be able to configure the above component using a data-driven approach,
// we need to first define, what properties can be configured using that data.
// The following interface represent your json data:
export type SoundConfig = {
    create?: GameSoundKey | null;
    remove?: GameSoundKey | null;
    hit?: GameSoundKey | null;
};

export const SoundComponent = declareComponent("Sound").withConfig<SoundData, SoundConfig>((container) => {
    // In this place, you can store some context information supplied by your game
    const sounds = container.get(GameSounds);
    return {
        // Optional: You can implement a reset method, which will be called to set initial values of a new component or when the component is reset.
        // Since we set all properties in the "build" method, the following is not needed. It might be useful though for garbage collection purposes:
        // reset(comp) {
        //     comp.removeSound = undefined;
        //     comp.hitSound = undefined;
        // },
        // Finally, the build method is used to set up the component data, which reads values from the blueprint and assigns it to the new component.
        build(comp, config) {
            // Use config() to receive configuration properties
            // It will automatically know the property names and types as specified in the config type above.
            // FIXME: possibility to not have a default value? => return undefined?
            const createSound = config(
                // config() has autocompletion for the properties you defined in the config type above!
                "create",
                // The second parameter is a fallback value, which gets used when no value was found for the specified key.
                // Its type is matched against the type in your config type above.
                null
            );
            comp.create = createSound ? sounds[createSound] : undefined;

            const removeSound = config("remove", null);
            comp.remove = removeSound ? sounds[removeSound] : undefined;
            const hitSound = config("hit", null);
            comp.hit = hitSound ? sounds[hitSound] : undefined;

            // Return false if you want to prevent the component from actually being added to the entity.
            // return false;
        },
    };
});

// You can declare a component without using a config. See FIXME

declare global {
    interface EntityConfig extends PartialEntityConfig<typeof SoundComponent> {}
}
