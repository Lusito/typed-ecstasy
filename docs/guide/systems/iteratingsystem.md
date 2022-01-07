# IteratingSystem

Most of the time, you will only need to iterate over a family of entities. In that case you can just extend the [IteratingSystem](../../api/classes/iteratingsystem.md) class and override its [processEntity()](../../api/classes/iteratingsystem.md#processentity) method.

```typescript
@service()
class MovementSystem extends IteratingSystem {
	public constructor(engine: Engine) {
		super(engine, Family.all(PositionComponent, VelocityComponent).get());
	}

	protected override processEntity(entity: Entity, deltaTime: number) {
		const position = entity.require(PositionComponent);
		const velocity = entity.require(SpyComponent);
			
		position.x += velocity.x * deltaTime;
		position.y += velocity.y * deltaTime;
	}
}
```
