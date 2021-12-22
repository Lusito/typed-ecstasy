# Object Pooling

## What is Pooling?

Object pooling is a technique to avoid costly re-allocations. This is especially important for JavaScript games, since anything that is not used anymore will get removed by the garbage collector and this can cause stuttering if you are not careful.

Instead of just removing all references to an object, it will be reset and put on a list, so that the next time you need a new object, you can use an old one.

## Pool

[Pool](../../api/classes/pool.md) is the base class for all pools. Unless you need to pool anything aside from entities and components, you don't need this class.

## PoolAllocator

A [PoolAllocator](../../api/classes/poolallocator.md) is the class to use if you want to pool entities and components.

Simple usage might look like this:
```typescript
const engine = new Engine(new PoolAllocator());
const entity = engine.obtainEntity();
entity.add(engine.obtainComponent(PositionComponent));
entity.remove(PositionComponent);
entity.destroy();
```

As long as you use the built-in methods to remove entities and components, you won't have to manually add them back to the pool.

The [data-driven approach](../data-driven/README.md) works with PoolAllocator as well:

```typescript
const engine = new Engine(new PoolAllocator());
const context: SampleContext = { /*...*/ };
// The EntityFactory generic type parameter must be explicitly set since the container can't detect it:
const factory: EntityFactory<EntityConfig> = engine.container.get(EntityFactory);
```

## Obtaining Entities and Components

In some situations, you'll want to allocate entities and components in your system. Use the engine property to do so:

```typescript
@service("ExplosionSystem")
class ExplosionSystem extends EntitySystem {
    // ...
    protected onExplode(entity: Entity): void {
        const entity = this.engine.obtainEntity();
        const position = this.engine.obtainComponent(PositionComponent);
        // ...
    }
}
```

## Things to Keep in Mind

- Don't keep references to entities/components that have been removed.
  - Check out [Special Considerations](./special-considerations.md#keeping-references) for more information on references.
- Object pooling comes at the cost of more memory usage. You might want to take a look at the [PoolAllocatorConfig](../../api/interfaces/poolallocatorconfig.md) to fine-tune the pools to your needs.
- If you configure a PoolAllocator, do not create entities with `new` anymore, but use `engine.obtainEntity` instead.
- Use the `reset` method on component declarations to clear references that might prevent garbage collection. This method will be called before the component is being put back on the pool.
