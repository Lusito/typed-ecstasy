import { Component } from "typed-ecstasy";

import { componentFactories } from "./componentFactories";

// First of all, we need the component itself. This is what you will interact with in your entity systems.
export class CameraFocusComponent extends Component {
    public weight = 1;

    // Optional: You can implement a reset method, which will be called if pooling is in place.
    // It will be called when the component gets removed and the pool didn't reach its maximum size yet.
    // But: This is rarely necessary, since you will mostly reset the values in the factory below.
    // It might be a valid use-case if the component keeps references that might prevent garbage collection.
    // public reset() {
    //     this.weight = 1;
    // }
}

// Then we need a configuration type, i.e. the data that is needed to assemble your entity correctly
// To be able to configure the above component using a data-driven approach,
// we need to first define, what properties can be configured using that data.
// The following interface represent your json data:
export type CameraFocusConfig = {
    weight?: number;
};

// Finally, we need to register a factory, which reads values from the blueprint and assigns it to the new component.
componentFactories.add(
    // The first parameter must be a key from SampleEntityConfig.
    "CameraFocus",
    // The second parameter is a factory function to assemble the component.
    (obtain, blueprint, context) => {
        // Use obtain() to create a component rather than creating one using `new`. This allows us to use object pooling.
        const comp = obtain(CameraFocusComponent);
        // Use blueprint.get to receive configuration properties
        // It will automatically know the property names and types as specified in the config type above.
        comp.weight = blueprint.get(
            // blueprint.get() has autocompletion for the properties you defined in the config type above!
            "weight",
            // The second parameter is a fallback value, which gets used when the blueprint does not have a value for the specified key.
            // Its type is matched against the type in your config type above.
            // Check out ../types.ts to find out what a context is!
            context.defaultCameraFocusWeight
        );

        // A component factory must return a fully initialized component or null if you want to skip adding this component for some reason.
        return comp;
    }
);
