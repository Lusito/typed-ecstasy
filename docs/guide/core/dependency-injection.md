# Dependency Injection

typed-ecstasy uses [typedi](https://docs.typestack.community/typedi/v/develop/01-getting-started) for dependency injection.

If you know typedi, you can already know most of this. It might be a good idea to quickly look over this though.

Imports are obviously coming from typedi:
```typescript
import { Service, Inject } from "typedi";
```

## What is Dependency Injection?

In short:
- Without dependency injection, you might need to pass dependencies (a shared service, a configuration object, etc.) manually to each system using its constructor or setters. This requires the code, which creates an instance of the system to know what the system needs.
- With dependency injection, you can simply define what the system needs in its constructor or via annotation and the dependency injection container will take care of creating the instance and supplying these dependencies.

**Notice:** Since the container takes care of creating instances, you no longer have the ability to manually specify arguments to the constructor of a system/service. You'll either have to pass these using setters or supply them as dependencies.

## @Service Annotation

All services (for example EntitySystem implementations) must be annotated with `@Service()`:

```typescript
@Service()
class MovementSystem extends EntitySystem {
    // ...
};
```

## Constructor Injection

If you need an instance of another service in a system, you can simply put it into the constructor:
```typescript
@Service()
class AssetService {
    // ...
};

@Service()
class RenderSystem extends EntitySystem {
    public constructor(assetService: AssetService) {
        //...
    }
};
```

## Property Injection

Alternatively, you can also specify the dependency with an `@Inject()` annotation:
```typescript
@Service()
class RenderSystem extends EntitySystem {
    @Inject()
    public readonly assetService!: AssetService;
    // notice the ! above, so typescript won't complain about the missing initialization
};
```

Keep in mind though, that you won't be able to access this property in the constructor, since it will be set after instantiation!
If you need to use it after instantiation, you can do this by overriding the [onEnable](../../api/classes/AbstractSystem.md#onEnable) method:

```typescript
@Service()
class RenderSystem extends EntitySystem {
    @Inject()
    public readonly assetService!: AssetService;
    // notice the ! above, so typescript won't complain about the missing initialization

    protected override onEnable() {
        const foo = this.assetService.get("foo");
        // ...
    }
};
```

## Container Instance

You can use [engine.getContainer()](../../api/classes/Engine.md#getContainer) to get the instance of the dependency injection container for an engine.
Alternatively, it's also possible to let it be injected in your service. Use `ContainerInstance` from typedi as type.

Using the container is not needed for creating/adding systems, this is done automatically for you. Use the container instance if you need more control.

## What is Injectable?

By default, you can inject everything that is marked with the `@Service` annotation. In addition, the Engine constructor adds a couple of extra classes, which can be injected:
- [Engine](./engine.md) The engine instance
- [Allocator](../../api/classes/Allocator.md) (either a plain or a [pooled](./pooling.md) allocator)
- The typedi `ContainerInstance` itself.

If you want to inject something, that is not marked with `@Service`, you must set it on the container manually:
```typescript
engine.getContainer().set(EntityFactory, myEntityFactory);
```
