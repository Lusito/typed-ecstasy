# Migration Guide

## Migration from V1 to V2

Version 2 changes quite a bit on how you create and access entities, components and systems.

The reason for this is:
- The introduction of [Dependency Injection](./core/dependency-injection.md).
- Extracting the logic of the entity and system management out of the engine into separate classes.
- The introduction of [object pooling](./core/pooling.md).
- The official introduction of [entity/component factories](./data-driven/README.md) (they existed in V1, but have not been well documented at the time).

While I would advice to read the new documentation, here's a quick guide on how to move your code from Version 1 to 2:

### Installation

Just follow the instructions in the [setup guide](./README.md)

### Changes to Your EntitySystems

1. First of all, check out the documentation on [Dependency Injection](./core/dependency-injection.md).
2. Remove all constructor parameters from your systems and either use dependency injection or setters to pass values to your system instead.
3. addedToEngine and removedFromEngine no longer exist. Instead, engine is added via dependency injection.
  - access it via `this.engine`.
  - Use `onEnable/onDisable` to execute startup code (some injected dependencies like engine might not be available yet in the constructor).
  - `setProcessing`, etc. has been renamed to `setEnabled`
4. Priority changes no longer require manual resorting. Do not override `set/getPriority` to avoid issues.

### Entity/System Managers

Most of the code in [Engine](./core/engine.md) has been moved into [EntityManager](../api/classes/entitymanager.md) and [EntitySystemManager](../api/classes/entitysystemmanager.md).

As such, you will have to change your calls from `engine.x` to `engine.entities.x` or `engine.systems.x`. Some properties and methods might have changed a bit in how they are accessed. It should be relatively obvious when you see the new properties/methods to see how you move to the new API.

### More Changes

More changes might be required, depending on what you used. It should feel relatively familiar though once you dig into it.
As said, I'd recommend for you to read the new documentation. I've spend a lot of time to write everything down.
