# Engine

The [Engine](../../api/classes/Engine.md) class is the center of the framework. Typically, you would have only one instance per application.

The engine is responsible for setting up and handling entity & system managers, etc.

## Creating an Engine

You can create an engine with the default constructor:
```typescript
const engine = new Engine();
```

You will learn more about the operations you can do with [Engine](../../api/classes/Engine.md) in the following tutorials.

## Dependency Injection Container

You can use [engine.getContainer()](../../api/classes/Engine.md#getContainer) to get the instance of the dependency injection container for this engine. Currently [typedi](https://docs.typestack.community/typedi/v/develop/01-getting-started) is being used.

**Make sure** to check out the page about [Dependency Injection](../core/dependency-injection.md).
