import { declareComponent, Container } from "typed-ecstasy";

import { GameConfig } from "../types";

// First of all, we need the component data type. This is what you will interact with in your entity systems.
export type CameraFocusData = {
    weight: number;
};

// Then we need a configuration type, i.e. the data that is needed to assemble your entity correctly
// To be able to configure the above component using a data-driven approach,
// we need to first define, what properties can be configured using that data.
// The following interface represent your json data:
export type CameraFocusConfig = {
    weight?: number;
};

export const CameraFocusComponent = declareComponent("CameraFocus").withConfig<CameraFocusData, CameraFocusConfig>(
    (container: Container) => {
        // In this place, you can store some context information supplied by your game
        const { defaultCameraFocusWeight } = container.get(GameConfig);
        return {
            // Optional: You can implement a reset method, which will be called to set initial values of a new component or when the component is reset.
            // Since we set the only property in the "build" method, the following is not needed:
            // reset(comp) {
            //     comp.weight = 1;
            // },
            // Finally, the build method is used to set up the component data, which reads values from the blueprint and assigns it to the new component.
            build(comp, config) {
                // Use blueprint.get to receive configuration properties
                // It will automatically know the property names and types as specified in the config type above.
                comp.weight = config(
                    // blueprint.get() has autocompletion for the properties you defined in the config type above!
                    "weight",
                    // The second parameter is a fallback value, which gets used when the blueprint does not have a value for the specified key.
                    // Its type is matched against the type in your config type above.
                    // Check out ../types.ts to find out what a context is!
                    defaultCameraFocusWeight
                );

                // Return false if you want to prevent the component from actually being added to the entity.
                // return false;
            },
        };
    }
);

// You can declare a component without using a config. See FIXME
