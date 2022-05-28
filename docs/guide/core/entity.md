# Entity

In typed-ecstasy, [entities](../../api/classes/Entity.md) are simple bags of components grouped under a unique ID. All non zero entity IDs are considered valid.

## Creating and Adding an Entity
If you want to create an Entity, you need to ask your [Engine](../../api/classes/Engine.md) for a new instance.

```typescript
const entity = new Entity();
```

Alternatively, you can assemble entities based on blueprints using a [data-driven approach](../data-driven/README.md):
```typescript
const entity = factory.assemble("car");
```

Entities need to be explicitly added to the engine so as to be processed by systems:

```typescript
engine.entities.add(entity);
```

The reason this is divided into two steps is to allow you to add all of your components to the entity before actually adding it to the engine.

Removing entities from the engine is rather simple.
Calling [engine.entities.remove()](../../api/classes/EntityManager.md#remove) or [entity.destroy()](../../api/classes/Entity.md#destroy) frees the entity ([possibly delayed](special-considerations.md)).

```typescript
engine.entities.remove(entity); // or entity.destroy();
```

## Entity IDs
As said, each entity has a unique ID. You can get it using [entity.getId()](../../api/classes/Entity.md#getid), which returns a `number`.
Entities will have an invalid ID (0) until they're added to an engine.

Entities can be retrieved from the engine using their ID:

```typescript
const entity = engine.getEntity(id);
```
