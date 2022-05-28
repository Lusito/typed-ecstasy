# SortedIteratingSystem

Whenever you need to iterate over a family of entities in a specific order, [SortedIteratingSystem](../../api/classes/SortedIteratingSystem.md) will be your friend. You simply need to specify the family, a comparator and implement the [processEntity()](../../api/classes/SortedIteratingSystem.md#processEntity) method.

Let's say we're writing a `RenderingSystem` that processes entities with a `RenderableComponent` and a `PositionComponent`. The `z` value of the position will determine the order in which entities are processed, the system will sort them for you automatically.

```typescript
function comparator(a: Entity, b: Entity): number {
	return a.require(PositionComponent).z - b.require(PositionComponent).z;
}

@Service()
class RenderingSystem extends SortedIteratingSystem {
	public constructor() {
		super(Family.all(RenderableComponent, PositionComponent).get(), comparator);
	}

	protected processEntity(entity: Entity, deltaTime: number): void {
		// Render the entity
	}
}
```
