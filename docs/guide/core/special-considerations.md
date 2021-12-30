# Special Considerations

Here are a couple of details on how typed-ecstasy deals with special situations you might want to know about.

## Delayed Removal of Entities, Components and Systems

Some operations will be delayed if issued while an entity system is being updated or listeners are being notified. This is because applying these operations immediately would affect iteration:

* Entity addition and removal
* Component addition and removal
* System additions, removals and priority changes

These delayed operations will be carried out as soon as the reason for the delay is resolved. Until then, the entity/component/system will be processed as usual.

In some situations you want to check if an entity is scheduled for removal. You can do so by using [entity.isScheduledForRemoval()](../../api/classes/entity.md#isscheduledforremoval).

There is currently no built-in way to check if a component or system is scheduled for removal. If you need this functionality, you'll need to add properties to the system or component to reflect this.

## Keeping References

Entities and components might get reused if [pooling](pooling.md) is configured.
So if you store references to entities or components, you might end up accessing something you did not intend.

- Never keep references to components!
  - Always access them via their entity.
  - You can, of course, declare a variable for it and pass that around, but don't remember it past an update-step.
- Avoid references to entities as much as possible.
  - The usual approach is to use systems to iterate over entities.
  - If you need an up-to-date list of all entities in the engine, use [engine.entities.getAll](../../api/classes/entitymanager.md#getAll).
  - If you need an up-to-date list of entities for a specific family, use [engine.entities.forFamily](../../api/classes/entitymanager.md#forfamily).
  - If you need to store a single entity, there are multiple ways to achieve this:
    - The most comfortable way is [by using an EntityRef](../../api/classes/entity.md#createref). Every time you need the entity, call `deref()` on the `EntityRef`. It will return undefined when the entity is no longer in use.
    - Alternatively, you can store the [id](../../api/classes/entity.md#getid) of the entity and when you need the entity, call [engine.entities.get](../../api/classes/entitymanager.md#get).
    - If the above approaches are not good for you and you store the entity itself, make sure to listen for the [onRemove](../../api/classes/entitymanager.md#onremove) or the [onRemoveForFamily](../../api/classes/entitymanager.md#onremoveforfamily) signal, so you can properly react to the entity no longer existing or matching your criteria.
