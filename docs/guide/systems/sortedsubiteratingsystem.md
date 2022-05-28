# SortedSubIteratingSystem

Going one step further, what if you want to perform multiple render steps for an entity before rendering the next one?
For example, render a sprite and above that some particle effects of a player. Both should be obscured by the tree that is in front of the player.

[SortedSubIteratingSystem](../../api/classes/SortedSubIteratingSystem.md) allows to add multiple [SubSystem](../../api/classes/SubSystem.md) instances to the system.

```typescript
@Service()
class SpriteRenderSystem extends SubSystem {
    public constructor() {
        super(Family.all(SpriteComponent).get());
    }

	public processEntity(entity: Entity, deltaTime: number) {
		// Render the sprite
	}
}

@Service()
class ParticleRenderSystem extends SubSystem {
    public constructor() {
        super(Family.all(ParticlesComponent).get());
    }

	public processEntity(entity: Entity, deltaTime: number) {
		// Render particles
	}
}

@Service()
class RenderSystem extends SortedSubIteratingSystem {
    public constructor() {
        super(Family.all(PositionComponent).one(SpriteComponent, ParticlesComponent).get(), comparator);
		this.subSystems.add(SpriteRenderSystem);
		this.subSystems.add(ParticleRenderSystem);
    }
}

```
