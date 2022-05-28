# IntervalIteratingSystem

It is also possible to combine the logic of [IteratingSystem](iteratingsystem.md) and [IntervalSystem](intervalsystem.md) thanks to [IntervalIteratingSystem](../../api/classes/IntervalIteratingSystem.md). In this case, you will need to implement its [processEntity()](../../api/classes/IntervalIteratingSystem.md#processEntity) method.

```typescript
@Service()
class MovementSystem extends IntervalSystem {
	public constructor() {
		super(Family.all(PositionComponent, VelocityComponent).get(), 0.016);
	}

	protected override processEntity(entity: Entity) {
		const position = entity.require(PositionComponent);
		const velocity = entity.require(SpyComponent);

		position.x += velocity.x;
		position.y += velocity.y;
	}
}
```
