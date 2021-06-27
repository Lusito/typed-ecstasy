# What is an ECS?

You might want to read this detailed [GameDev.net Article](https://www.gamedev.net/page/resources/_/technical/game-programming/understanding-component-entity-systems-r3013) about Entity Component Systems, but just in case the above link is broken or you want a shorter explanation, I'll summarize it:

## Inheritance
Some games, especially older ones, would create entities by using inheritance and store both data and logic in classes:
- Entity
  - Character
    - Player
    - Enemy
  - Item

But this way, you might end up duplicating code and possibly having very large classes containing all the logic.

## Composition Over Inheritance
With an ECS, instead of creating classes, which contain both data and logic for a specific entity type, you separate the data and the logic:
- An entity is only an id and a list of components
- A component contains only data
- A system contains the logic to process entities with certain components

### Component Examples
- PositionComponent (x, y)
- HealthComponent (value)
- SpriteComponent (image, animations, ...)

### System Examples
- PhysicsSystem - Applies velocity to positions and checks for collision
- RenderSystem - Draws sprites
- DamageSystem - Adjusts the health level in case of a damage event.

## Benefits

- Write logic that can be reused on multiple entity types and doesn't have to know how the other game logic behaves.
- Use a data-driven approach or persist your game-state.
- Prevent conflicts while multiple people work on the same entity type, but on different logic.
- Creating new entity types might be as easy as composing different components.
- Trying new logic is a matter of enabling new systems and possibly disabling others.
