# Dependency Injection

typed-ecstasy uses a custom implementation for dependency injection, since there is currently no other dependency injection framework supporting hot module replacement.

If you have worked with dependency injection, you can already know most of this. There are some differences though to consider.

The imports for the dependency injection are currently bundled with typed-ecstasy:
```typescript
import { service, retainable } from "typed-ecstasy";
```

## What is Dependency Injection?

**Note:** Everywhere I say "service", it also means "system", as a system is a service.

In short:
- Without dependency injection, you might need to pass dependencies (a shared service, a configuration object, etc.) manually to each service using its constructor or setters. This requires the code, which creates an instance of the service to know what the service needs.
- With dependency injection, you can simply define what the service needs in its constructor and the dependency injection container will take care of creating the instance and supplying these dependencies.

**Notice:** Since the container takes care of creating instances, you no longer have the ability to manually specify arguments to the constructor of a service. You'll either have to pass these using setters or supply them as dependencies.

## @service Decorator

All services (for example EntitySystem implementations) must be annotated with `@service(name, config?)`:

```typescript
@service("MovementSystem")
class MovementSystem extends EntitySystem {
    // ...
}
```

Now, you might wonder why you need to specify a (unique) name to the decorator. This is here to enable [hot module replacement](./hot-module-replacement.md).
Ideally, this would be automatically supplied, but I haven't found a way to do this reliably yet.

You should remember, that this name is needed and must be unique within your application. If you plan on providing a library with services, I suggest to establish a naming convention. For example `<package-name>/<service-name>`.

### Transient Services

By default, all services are non-transient. This means, that each time you require a service, you'll get the same instance (within the same container).
Making it transient means, that a new instance is created whenever someone requests the service.

```typescript
@service("RandomService", { transient: true })
class RandomService {}
```

## Constructor Injection

If you need an instance of another service in a service, you can simply put it into the constructor:
```typescript
@service("AssetService")
class AssetService {
    // ...
}

@service("RenderSystem")
class RenderSystem extends EntitySystem {
    public constructor(assetService: AssetService) {
        //...
    }
};
```

## What is Injectable?

By default, you can inject all classes that are marked with the `@service` decorator. In addition, the Engine container has a couple of extra values, which can be injected:
- [Engine](./engine.md) The engine instance
- [Container](../../api/classes/container.md)

If you want to inject something, that is not marked with `@service`, you must set it on the container manually. See the following examples for more details.

## Injecting a Non-Service

At some point you might find yourself wanting to provide something to services globally, but not wanting to create a service for this.
TypeScript needs to have a type and a value to be able to automatically detect what is to be injected.

### Injecting a Class Instance
If you want to inject an instance of a class, you're already good to go, since classes have a type and a value by default.

```ts
class MyData { /* ... */ }

// At initialization, set the value on your container:
engine.container.set(MyData, new MyData());

// Use constructor injection
@service("DataService")
class DataService {
    public constructor(data: MyData) {
        //...
    }
};
```

### Injecting a Non-Class Value

When you don't have a class, it's a little tricker, but possible nonetheless.
```ts
// First, we create a type (it can be an alias).
export type GameContext2D = CanvasRenderingContext2D;
// Then we create a value, which must have the same name as the type.
export const GameContext2D = InjectSymbol<GameContext2D>("GameContext2D");
// The string parameter to InjectSymbol helps identify problems when debugging.

// At initialization, set the value on your container:
engine.container.set(GameContext2D, canvas.getContext("2d"));

// Use constructor injection
@service("DataService")
class DataService {
    public constructor(context2D: GameContext2D) {
        //...
    }
};
```

## Container Instance

The `Container` instance can be used to get or set values.

You don't need this if you want to inject a service into your service. **Use the container instance only if you need more control**.

Ways to get the container instance:
- Use [engine.container](../../api/classes/engine.md#getcontainer).
- Use the `Container` class as type for a constructor parameter in your service.
