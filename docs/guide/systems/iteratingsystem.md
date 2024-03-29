# IteratingSystem

Most of the time, you will only need to iterate over a family of entities. In that case you can just extend the [IteratingSystem](../../api/classes/IteratingSystem.md) class and override its [processEntity()](../../api/classes/IteratingSystem.md#processEntity) method.

```typescript
@Service()
class MovementSystem extends IteratingSystem {
	public constructor() {
		super(Family.all(PositionComponent, VelocityComponent).get());
	}

	protected override processEntity(entity: Entity, deltaTime: number) {
		const position = entity.require(PositionComponent);
		const velocity = entity.require(SpyComponent);
			
		position.x += velocity.x * deltaTime;
		position.y += velocity.y * deltaTime;
	}
}
```
