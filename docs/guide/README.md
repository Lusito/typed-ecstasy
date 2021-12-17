# Setup

## Install With NPM

```bash
npm i typed-ecstasy typed-signals
```

## Install With Yarn

```bash
yarn add typed-ecstasy typed-signals
```

## Enable Annotations and Reflection

Since typed-ecstasy uses dependency injection, we'll need some extra work if you don't have this set up yet:

Your tsconfig will need these two options:
```json
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
```

You'll also need a reflection library. I'll recommend [@abraham/reflection](https://github.com/abraham/reflection), but you can use others like [reflect-metadata](https://github.com/rbuckton/reflect-metadata) as well:

### Install With NPM

```bash
npm i @abraham/reflection
```

### Install With Yarn

```bash
yarn add @abraham/reflection
```

In your entrypoint file, you'll need to import this:

```typescript
import '@abraham/reflection';
```
