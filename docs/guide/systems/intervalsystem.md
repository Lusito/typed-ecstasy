# IntervalSystem

Sometimes you might want to make a system not run every tick, but at constant intervals. Rather than messing about with [setEnabled()](../../api/classes/IntervalSystem.md#setEnabled) you can extend the [IntervalSystem](../../api/classes/IntervalSystem.md) class and implement its [updateInterval()](../../api/classes/IntervalSystem.md#updateInterval) method.

```typescript
@Service()
class TickSystem extends IntervalSystem {
	private tick = 0;

	public constructor() {
		super(0.016);
	}

	protected override updateInterval() {
		this.tick++;
	}
}
```
