import {
    Engine,
    AbstractEntityFactory,
    PartialEntityConfig,
    InjectSymbol,
    service,
    PostConstruct,
    registerComponent,
    Component,
} from "typed-ecstasy";

/**
 * GameConfig is just an example for a custom manual dependency.
 * This could, for example, be (or contain) an asset manager.
 * For the sake of this simple demo, one simple property will suffice.
 */
type GameConfig = {
    defaultCameraFocusWeight: number;
};

// Notice how we also create and export a value here.
// This is required, so that it can be used in the dependency injection.
// If you have a class, this hack is not needed, since classes already have a type and a value.
const GameConfig = InjectSymbol<GameConfig>("GameConfig");

// Check out CameraFocusComponent for a more detailed explanation of how to declare components
type PositionConfig = {
    x?: number;
    y?: number;
};

class PositionComponent extends Component {
    public static readonly key = "Position";
    public static readonly unusedConfig: PositionConfig;

    public x!: number;
    public y!: number;
}

registerComponent(PositionComponent, {
    build(comp, config) {
        comp.x = config("x", 1);
        comp.y = config("y", 2);
    },
});

type SpriteConfig = {
    image: string;
    layer?: number;
};

class SpriteComponent extends Component {
    public static readonly key = "Sprite";
    public static readonly unusedConfig: SpriteConfig;

    public image!: string;
    public layer!: number;
}

registerComponent(SpriteComponent, {
    build(comp, config) {
        comp.image = config("image", "notfound.png");
        comp.layer = config("layer", 1);
    },
});

type PickupConfig = {
    material: "stone" | "wood";
    amount: number;
};

class PickupComponent extends Component {
    public static readonly key = "Pickup";
    public static readonly unusedConfig: PickupConfig;

    public material!: "stone" | "wood";
    public amount!: number;
}

registerComponent(PickupComponent, {
    build(comp, config) {
        comp.material = config("material", "wood");
        comp.amount = config("amount", 1);
    },
});

type CameraFocusConfig = {
    weight?: number;
};

class CameraFocusComponent extends Component {
    public static readonly key = "CameraFocus";
    public static readonly unusedConfig: CameraFocusConfig;

    public weight!: number;
}

registerComponent(CameraFocusComponent, (container) => {
    const { defaultCameraFocusWeight } = container.get(GameConfig);
    return {
        build(comp, config) {
            comp.weight = config("weight", defaultCameraFocusWeight);
        },
    };
});

type VelocityConfig = {
    x?: number;
    y?: number;
};

class VelocityComponent extends Component {
    public static readonly key = "Velocity";
    public static readonly unusedConfig: VelocityConfig;

    public x!: number;
    public y!: number;
}

registerComponent(VelocityComponent, {
    build(comp, config) {
        comp.x = config("x", 1);
        comp.y = config("y", 2);
    },
});

type EntityConfig = PartialEntityConfig<typeof CameraFocusComponent> &
    PartialEntityConfig<typeof PickupComponent> &
    PartialEntityConfig<typeof PositionComponent> &
    PartialEntityConfig<typeof SpriteComponent> &
    PartialEntityConfig<typeof VelocityComponent>;

const blueprints: Record<string, EntityConfig> = {
    stone: {
        Position: {
            x: 10.1,
            y: 11.2,
        },
        Velocity: {
            x: 100,
            y: 150,
        },
        Sprite: {
            image: "stone.png",
            layer: 3,
        },
        Pickup: {
            material: "stone",
            amount: 4,
        },
        CameraFocus: {
            weight: 42,
        },
    },
    void: {
        Position: {},
    },
    missing_component: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Missing: {},
    },
};

@service()
class EntityFactory extends AbstractEntityFactory<keyof typeof blueprints> {
    protected [PostConstruct]() {
        this.setBlueprints(blueprints);
    }
}

describe("EntityFactory", () => {
    const engine = new Engine();
    engine.container.set(GameConfig, {
        defaultCameraFocusWeight: 42,
    });
    const warnSpy = jest.spyOn(console, "warn").mockImplementationOnce(() => undefined);
    const factory = engine.container.get(EntityFactory);

    it("shows a warning for components that have not been registered", () => {
        expect(warnSpy).toHaveBeenCalledWith(
            `Can't find metadata for component "Missing". This component will not be added!`
        );
    });

    it("ignores components that have not been registered", () => {
        expect(() => factory.assemble("missing_component")).not.toThrow();
    });

    it("throws an error if an entity blueprint is missing", () => {
        expect(() => factory.assemble("whoops")).toThrow("Could not find entity blueprint for 'whoops'");
    });

    it("uses override properties if given", () => {
        const entity = factory.assemble("stone", {
            Position: {
                x: 1337,
                y: 1337,
            },
        });
        const pos = entity.require(PositionComponent);
        expect(pos.x).toBe(1337);
        expect(pos.y).toBe(1337);
    });

    it("uses values from the entity blueprint if no overrides are given", () => {
        const entity = factory.assemble("stone");

        const pos = entity.require(PositionComponent);
        expect(pos.x).toBe(10.1);
        expect(pos.y).toBe(11.2);
        const sprite = entity.require(SpriteComponent);
        expect(sprite.layer).toBe(3);
        expect(sprite.image).toBe("stone.png");
        const pickup = entity.require(PickupComponent);
        expect(pickup.material).toBe("stone");
        expect(pickup.amount).toBe(4);
        const cameraFocus = entity.require(CameraFocusComponent);
        expect(cameraFocus.weight).toBe(42);
    });

    it("uses default values if neither the entity blueprint has values nor override properties have been given", () => {
        const entity = factory.assemble("void");

        const pos = entity.require(PositionComponent);
        expect(pos.x).toBe(1);
        expect(pos.y).toBe(2);
    });
});
