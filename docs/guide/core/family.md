# Family

Entities with the same set of components can be grouped in [Family](../../api/classes/family.md) objects.

A [Family](../../api/classes/family.md) is defined by:
* A set of components the entity must have.
* A set of components of which the entity must have at least one.
* A set of components the entity cannot have.

## Obtaining a Family
You can obtain a [Family](../../api/classes/family.md) by specifying the list of component classes the entities belonging to said family must (not) possess. This should satisfy most of your entity classification needs.

```typescript
const family = Family.all(PositionComponent, VelocityComponent).get();
```

Imagine we want to group all entities that should be rendered. It certainly must have a position and either a texture or a particle system. Additionally, we need to make sure it is not invisible. These constraints can easily be represented the following way.

```typescript
const family = Family.all(PositionComponent)
		.one(TextureComponent, ParticleComponent)
		.exclude(InvisibleComponent)
		.get();
```

## Getting a List of Entities Which Belong to a Family
The [EntityManager](../../api/classes/entitymanager.md) has the capability of providing the full collection of entities that match a specific family.

```typescript
const entities = engine.entities.forFamily(family);
```

Usually you'd store the result in the attribute of an [EntitySystem](entitysystem.md) (the returned array will always be the same and as such up-to-date).

You can iterate over them either with a *for of* loop:
```typescript
for (const entity of entities) {
	...
}
```

But also using a classic loop:
```typescript
for (let i = 0; i < entities.length; ++i) {
	const entity = entities[i];
	...
}
```
