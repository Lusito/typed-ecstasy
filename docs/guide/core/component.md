# Components

FIXME: This needs to be rewritten:

[Components](../../api/classes/component.md) are meant to be data bags and nothing more. All logic should be placed in ([EntitySystems](entitysystem.md)). So it is recommended to declare components like plain c-structs. Adding getters and setters is acceptable though.

### Creating component classes
To define a new component, you only need to extend the [Component](../../api/classes/component.md) class.

In the following example we define two components: `PositionComponent` and `VelocityComponent`.

```typescript
class PositionComponent extends Component {
	x = 0;
	y = 0;
}
class VelocityComponent extends Component {
	x = 0;
	y = 0;
}
```

The collection of components an entity has will determine its behavior. Adding components to an entity is dead easy. However, mind that entities can not hold two components of the same class. So, when you add a component type twice, the second one will replace the first one.

## Adding Components to an Entity
You can assign components easily using add:
```typescript
entity.add(new PositionComponent());
entity.add(new VelocityComponent());
```

Alternatively, you can assemble entities based on blueprints using a [data-driven approach](../data-driven/README.md).

## Removing Components From an Entity

You can remove components from entities any time ([this might be delayed](special-considerations.md)).

```typescript
entity.remove(PositionComponent); // remove just one specific component
entity.removeAll(); // remove all components
```

## Getting an Entities Component
Retrieving components can be done as follows.

```typescript
const position = entity.get(PositionComponent);
const velocity = entity.get(VelocityComponent);
```

[entity.get()](../../api/classes/entity.md#get) will return `null` if the component does not exist in the entity. You can use [entity.has()](../../api/classes/entity.md#has) to check if the entity has a component of the specified class.

You can also get an entity using [entity.require()](../../api/classes/entity.md#require). If the component does not exist, an exception will be thrown. You should use [entity.require()](../../api/classes/entity.md#require) only if you know that the component exist. For example if you are using an iterating EntitySystem, which already covers the existence with its Family.
```typescript
const position = entity.require(PositionComponent);
```

## Getting All Components
You can get all components at once by doing this.

```typescript
const components = entity.getAll();
```

You can iterate over them either with a *for of* loop:
```typescript
for (const component of components) {
	...
}
```

But also using a classic loop:
```typescript
for (let i = 0; i < components.length; ++i) {
	const component = components[i];
	...
}
```

