# SortedSubIteratingSystem

Going one step further, what if you want to perform multiple render steps for an entity before rendering the next one?
For example, render a sprite and above that some particle effects of a player. Both should be obscured by the tree that is in front of the player.

[SortedSubIteratingSystem](../../api/classes/sortedsubiteratingsystem.md) allows to add multiple [SubSystem](../../api/classes/subsystem.md) instances to the system.

```typescript
@service()
class SpriteRenderSystem extends SubSystem {
    public constructor(engine: Engine) {
		super(engine, Family.all(SpriteComponent).get());
    }

	public processEntity(entity: Entity, deltaTime: number) {
		// Render the sprite
	}
}

@service()
class ParticleRenderSystem extends SubSystem {
    public constructor(engine: Engine) {
		super(engine, Family.all(ParticlesComponent).get());
    }

	public processEntity(entity: Entity, deltaTime: number) {
		// Render particles
	}
}

@service()
class RenderSystem extends SortedSubIteratingSystem {
    public constructor(engine: Engine) {
		super(engine, Family.all(PositionComponent).one(SpriteComponent, ParticlesComponent).get(), comparator);
		this.subSystems.add(SpriteRenderSystem);
		this.subSystems.add(ParticleRenderSystem);
    }
}

```
