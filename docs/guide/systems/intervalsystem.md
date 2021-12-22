# IntervalSystem

Sometimes you might want to make a system not run every tick, but at constant intervals. Rather than messing about with [setEnabled()](../../api/classes/intervalsystem.md#setenabled) you can extend the [IntervalSystem](../../api/classes/intervalsystem.md) class and implement its [updateInterval()](../../api/classes/intervalsystem.md#updateinterval) method.

```typescript
@service("TickSystem")
class TickSystem extends IntervalSystem {
	private tick = 0;

	public constructor(engine: Engine) {
		super(engine, 0.016);
	}

	protected override updateInterval() {
		this.tick++;
	}
}
```
