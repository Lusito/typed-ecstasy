import type { Container } from "../di";

/**
 * Base class for all components.
 */
export class Component {
    public static readonly id: number;
    /** @internal */
    protected readonly componentBuilder!: never;

    /**
     * Checks if this component is an instance of the passed class.
     *
     * @param Class The component class.
     * @returns True if the component matches the class.
     */
    public isInstanceOf<T extends Component>(Class: ComponentClass<any, T>): this is T {
        return Class.id === (this.constructor as ComponentClass).id;
    }
}

export type ComponentConfigGetter<T> = <TKey extends Extract<keyof T, string>>(
    key: TKey,
    fallback: Exclude<T[TKey], undefined>
) => Exclude<T[TKey], undefined>;

export type ComponentBuilder<TType, TConfig> = {
    reset?(comp: TType): void;
} & ([TConfig] extends [never]
    ? {
          build?(comp: TType): void | boolean;
      }
    : {
          build(comp: TType, config: ComponentConfigGetter<TConfig>): void | boolean;
      });

export type ComponentFactory<TType, TConfig> =
    | ComponentBuilder<TType, TConfig>
    | ((container: Container) => ComponentBuilder<TType, TConfig>);

export type ComponentClass<TName extends string = string, TType extends Component = any> = {
    readonly key: TName;
    readonly id: number;
    new (): TType;
};

export type ComponentClassWithConfig<
    TName extends string = string,
    TType extends Component = any,
    TConfig = any
> = ComponentClass<TName, TType> & {
    readonly unusedConfig: TConfig;
};
