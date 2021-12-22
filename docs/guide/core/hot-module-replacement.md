# Hot Module Replacement

The biggest feature addition in V3 is Hot Module Replacement.

## What is Hot Module Replacement (HMR)?

**In simple words:** [Hot module replacement](https://webpack.js.org/concepts/hot-module-replacement/) means, that when you save a file while developing, the code (logic) will be replaced, but state (data) can be kept. 

While investigating a bug in a game, I had to always go back to the same place and repeat the same steps to be able to reproduce the bug, since every save would reload the entire game. I could have created a special level with this bug, but most most modern bundlers (that have a development server) nowadays support hot module replacement, so why not use this?

This is already being used widely in Single Page Application frameworks like React. I couldn't find any game-related libraries that support this though.
HMR should work perfectly with an entity-component system, since we already separate logic (systems) and data (components).

The support for HMR in typed-ecstasy has been tested with webpack and parcel. Others might also work if they have a [similar API](https://webpack.js.org/api/hot-module-replacement/).

## How to Enable HMR in typed-ecstasy

Enabling HMR in typed-ecstasy is a two-step process.

### Service Decorator

The first step is to supply the hot API to the `@service` decorator, so that the logic can be replaced:

```ts
@service("MovementSystem", { hot: module.hot })
```

Or if you are using webpack in strict ESM Mode:

```ts
@service("MovementSystem", { hot: import.meta.webpackHot })
```

Once you do that, special code will will be used to proxy all references to services. Note that this will only have effect while running the dev-server. Production build will **not** have any negative impacts if you leave it, so it's good practice to always specify it for all services.

What this means is that anyone who requests MovementSystem will get a proxy instead of the real service. The proxy will forward all requests to the real service. When the file gets changed, the old service instance will be disabled, a new service instance will be created and the proxy will be changed to forward all requests to the new service.

### Retaining Data

The second step is to annotate all properties you want to transfer to the new instance using the `@retainable` decorator.
Most services will probably want to store some data, for example if you have a set of listeners. By recreating the service, all class properties will be lost.

We can prevent this by marking class properties with the `@retainable` decorator. When the old service instance is being removed, all properties marked with this decorator will be stored and then restored in the new service instance.

```ts
@retainable
private listeners = new Set<MyListener>();
```

Of course, for this to work, both the old service class and the new service class needs to have this decorator on the property. Otherwise, no action will be performed. If you have such a situation, wou will need to reload the webpage.

### Special Considerations

You should make override the onEnable and onDisable of your systems to correctly set up and clean up your logic, so the replaced system leaves nothing behind.

For example if you add a listener, always make sure to remove it in onDisable:

```ts
protected override onEnable(): void {
    // Don't forget to call the super-method
    super.onEnable();
    this.messageService.addListener(this.onMessage);
}

protected override onDisable(): void {
    // Don't forget to call the super-method
    super.onDisable();
    this.messageService.removeListener(this.onMessage);
}
```

**Additional note:** onDisable will be called before `@retainable` properties are stored, so you can prepare them if needed.

**FIXME:** This only works for systems, but other services don't have onEnable/onDisable code, so how to handle them?.
- decorators for @postConstruct/@preDestroy?
- just methods named postConstruct/preDestroy?
- pass container as parameter?