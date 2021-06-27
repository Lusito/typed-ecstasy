# Signal

A signal is an easy way to emit events and listen for them. You can use signals in your game for example to tell listeners, that something exploded.

A while back I came across this neat article about a good C++11 signal system:
[Performance of a C++11 Signal System](https://testbit.eu/cpp11-signal-system-performance/)
typed-ecstasy uses [typed-signals](https://github.com/Lusito/typed-signals), a TypeScript port of said article.

## Built-In Signals

typed-ecstasy uses signals in the [EntityManager](../../api/classes/entitymanager.md), specifically:
- [onAdd](../../api/classes/entitymanager.md#onadd)
- [onRemove](../../api/classes/entitymanager.md#onremove)
- [onAddForFamily](../../api/classes/entitymanager.md#onaddforfamily)
- [onRemoveForFamily](../../api/classes/entitymanager.md#onremoveforfamily)

These will be emitted when an entity gets added/removed to/from the engine or a specific family.
