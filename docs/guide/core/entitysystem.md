# Entity System

[EntitySystem](../../api/classes/entitysystem.md) derived classes contain the logic that process our game entities.

**Make sure** to check out the page about [Dependency Injection](../core/dependency-injection.md).

## Creating a Custom EntitySystem
In addition to extending the [built-in entitysystems](../systems/README.md), you can extend [EntitySystem](../../api/classes/entitysystem.md) itself.

These are some methods you might want to override.

```typescript
/**
 * Called when this EntitySystem is added to the engine or re-enabled after being disabled.
 */
protected onEnable() {}

/**
 * Called when this EntitySystem is removed from the engine or being disabled.
 */
protected onDisable() {}

/**
 * The update method called every tick.
 *
 * @param deltaTime The time passed since last frame in seconds.
 */
public abstract update(deltaTime: number): void;
```

For instance, let us say we want to change our entities' position according to their velocity. We can create a `MovementSystem` that takes care of it.

```typescript
@Service()
class MovementSystem extends EntitySystem {
	private entities: Entity[] = [];
	
	protected override onEnable() {
		this.entities = this.engine.forFamily(Family.all(PositionComponent, VelocityComponent).get());
	}

	protected override onDisable() {
		this.entities = [];
	}

	protected override update(deltaTime: number) {
		for (const entity of this.entities) {
			const position = entity.require(PositionComponent);
			const velocity = entity.require(VelocityComponent);
			
			position.x += velocity.x * deltaTime;
			position.y += velocity.y * deltaTime;
		}
	}
};

```
Of course, the above can be simplified, by using the built-in [IteratingSystem](../systems/iteratingsystem.md)

## Adding EntitySystems to the Engine
An Engine can never hold two systems of the same class. So when adding a system of the same class twice, the second will replace the first.

Do the following to register a system with the engine.

```typescript
// Using the return value is of course optional
const movementSystem = engine.systems.add(MovementSystem);
```

## Removing an EntitySystem From the Engine
Anytime you want, you can remove a system from the engine (which will effectively delete it).

```typescript
engine.systems.remove(MovementSystem);
```

Be careful though if you remove systems, which are still referenced in other places.

Removing a system from the engine will also remove it from the dependency container, so unless you have other references to the system, it should be garbage collected.

## Updating All Systems

A call to [engine.update(deltaTime)](../../api/classes/engine.md#update) will update all the registered entity systems according to their priority order. The lower the priority level, the sooner the system will be updated. You can change the priority of a system using its [setPriority()](../../api/classes/entitysystem.md#setpriority) method.

## Retrieving an EntitySystem From the Engine
A system can be retrieved from an engine reference by its class.

```typescript
const movementSystem = engine.systems.get(MovementSystem);
```

## Enabling/Disabling Entitysystems Without Removing Them
You can enable/disable systems whenever you want. So, if what you need is to temporarily pause a system, you do not need to remove and later re-add it. When a system is disabled, it will not be updated by the engine.

```typescript
movementSystem.setEnabled(false);
``` 

## Built-in EntitySystems
typed-ecstasy comes with a few abstract [built-in entitysystems](../systems/README.md) that might make your life easier and avoid some boilerplate code.