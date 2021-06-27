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

- It's good advice to never keep references to components.
  - Always access them via their entity.
- Avoid references to entities as much as possible.
  - You can, store the entity-id instead and then retrieve the entity from the entity-manager [by using this id](../../api/classes/entitymanager.md#get).
  - If you absolutely must store an entity reference, make sure to listen for the onRemove signal, so you can clear this reference.

Entities and components might get reused if [pooling](pooling.md) is configured, so you might end up accessing an entity that is now something entirely different if you keep a reference.
