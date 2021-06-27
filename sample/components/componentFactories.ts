import { createComponentFactoryRegistry } from "typed-ecstasy";

import type { SampleContext, SampleEntityConfig } from "../types";

// We define a component factory registry here, which knows the types we want to use
export const componentFactories = createComponentFactoryRegistry<SampleEntityConfig, SampleContext>();
