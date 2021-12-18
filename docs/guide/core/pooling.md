# Object Pooling

## What is Pooling?

Object pooling is a technique to avoid costly re-allocations. This is especially important for JavaScript games, since anything that is not used anymore will get removed by the garbage collector and this can cause stuttering if you are not careful.

Instead of just removing all references to an object, it will be reset and put on a list, so that the next time you need a new object, you can use an old one.

## Pool

[Pool](../../api/classes/pool.md) is the base class for all pools. Unless you need to pool anything aside from entities and components, you don't need this class.

## Poolable

[Poolable](../../api/interfaces/poolable.md) Is an interface, which can be implemented on objects to be able to reset them to their default state.
Simply implement the [reset()](../../api/interfaces/poolable.md#reset) method and you're good to go:

```typescript
export class DataComponent extends Component implements Poolable {
    public data: MyData | null = null;

    public reset() {
        this.data = null;
    }
}
```

This method is completely optional. `reset()` will be called when the object gets freed **and** the pool didn't reach its maximum size yet.

You rarely need to implement this method if you always set all properties after obtaining an instance.
It might be a valid use-case if the object keeps references that might prevent garbage collection.

## PoolAllocator

A [PoolAllocator](../../api/classes/poolallocator.md) is the class to use if you want to pool entities and components.

Simple usage might look like this:
```typescript
const allocator = new PoolAllocator();
const engine = new Engine(allocator);
const entity = allocator.obtainEntity();
entity.add(allocator.obtainComponent(PositionComponent));
entity.remove(PositionComponent);
entity.destroy();
```

As long as you use the built-in methods to remove entities and components, you won't have to manually add them back to the pool.

The [data-driven approach](../data-driven/README.md) works with PoolAllocator as well:

```typescript
const allocator = new PoolAllocator();
const engine = new Engine(allocator);
const context: SampleContext = { /*...*/ };
// fixme: adjust
const factory = new EntityFactory<SampleEntityConfig, SampleContext>(componentFactories, context, allocator);
```

## Injecting the Allocator Into Your Systems or Other Services

In some situations, you'll want to use the allocator in a system. The class to use here is [Allocator](../../api/classes/allocator.md) (and not PoolAllocator!):

```typescript
@Service()
class ExplosionSystem extends EntitySystem {
    private allocator: Allocator;

    public constructor(allocator: Allocator) {
        super(Family.all(ComponentA, ComponentB).get());
        this.allocator = allocator;
        // ...
    }

    protected onExplode(entity: Entity): void {
        const entity = this.allocator.obtainEntity();
        // ...
    }
}
```

There will always be an Allocator available for injection, even if you didn't configure a PoolAllocator. This allows you to easily switch between pooling and no pooling during instantiation of the Engine.

## Things to Keep in Mind

- Don't keep references to entities/components that have been removed.
  - Check out [Special Considerations](./special-considerations.md#keeping-references) for more information on references.
- Object pooling comes at the cost of more memory usage. You might want to take a look at the [PoolAllocatorConfig](../../api/interfaces/poolallocatorconfig.md) to fine-tune the pools to your needs.
- If you configure a PoolAllocator, do not create entities and components with `new` anymore, but use the allocator instead.
- Only implement the reset method if you really need it to avoid setting values that will be overwritten anyway.
