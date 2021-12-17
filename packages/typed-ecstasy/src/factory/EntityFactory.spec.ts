import { Allocator, Component, ComponentBlueprint, createComponentFactoryRegistry, EntityFactory } from "typed-ecstasy";

type SampleEntityConfig = {
    Position?: PositionConfig;
    Sprite?: SpriteConfig;
    Pickup?: PickupConfig;
    CameraFocus?: CameraFocusConfig;
};

type SampleContext = {
    defaultCameraFocusWeight: number;
};

const componentFactories = createComponentFactoryRegistry<SampleEntityConfig, SampleContext>();

class PositionComponent extends Component {
    public x = 0;
    public y = 0;
}

type PositionConfig = {
    x?: number;
    y?: number;
};

componentFactories.add("Position", (obtain, blueprint) => {
    const comp = obtain(PositionComponent);
    comp.x = blueprint.get("x", 1);
    comp.y = blueprint.get("y", 2);
    return comp;
});

class SpriteComponent extends Component {
    public image = "";
    public layer = 0;
}

type SpriteConfig = {
    image: string;
    layer?: number;
};

componentFactories.add("Sprite", (obtain, blueprint) => {
    const comp = obtain(SpriteComponent);
    comp.image = blueprint.get("image", "notfound.png");
    comp.layer = blueprint.get("layer", 1);
    return comp;
});

class PickupComponent extends Component {
    public material: "stone" | "wood" = "wood";
    public amount = 1;
}

type PickupConfig = {
    material: "stone" | "wood";
    amount: number;
};

componentFactories.add("Pickup", (obtain, blueprint) => {
    const comp = obtain(PickupComponent);
    comp.material = blueprint.get("material", "wood");
    comp.amount = blueprint.get("amount", 1);
    return comp;
});

class CameraFocusComponent extends Component {
    public weight = 1;
}

type CameraFocusConfig = {
    weight?: number;
};

componentFactories.add("CameraFocus", (obtain, blueprint, context) => {
    const comp = obtain(CameraFocusComponent);
    comp.weight = blueprint.get("weight", context.defaultCameraFocusWeight);
    return comp;
});

const stoneBlueprint: SampleEntityConfig = {
    Position: {
        x: 10.1,
        y: 11.2,
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
};

const voidBlueprint: SampleEntityConfig = {
    Position: {},
};

// This is a map of entity names to entity blueprints
const blueprints: Record<string, SampleEntityConfig> = {
    stone: stoneBlueprint,
    void: voidBlueprint,
};

function setupEntityFactory() {
    const context: SampleContext = { defaultCameraFocusWeight: 1 };
    const allocator = new Allocator();
    const factory = new EntityFactory<SampleEntityConfig, SampleContext>(componentFactories, context, allocator);

    for (const name of Object.keys(blueprints)) {
        const entityConfig = blueprints[name];

        const entityBlueprint = Object.keys(entityConfig).map(
            // eslint-disable-next-line no-loop-func
            (key) => new ComponentBlueprint(key, entityConfig[key as keyof SampleEntityConfig])
        );
        factory.addEntityBlueprint(name, entityBlueprint);
    }

    return factory;
}

describe("EntityFactory", () => {
    const factory = setupEntityFactory();

    it("throws an error if an entity blueprint is missing", () => {
        expect(() => factory.assemble("whoops")).toThrow("Could not find entity blueprint for 'whoops'");
    });

    it("throws an error if a component factory is missing", () => {
        factory.addEntityBlueprint("missing_component", [new ComponentBlueprint("Missing", {})]);
        expect(() => factory.assemble("missing_component")).toThrow("Could not find component factory for 'Missing");
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
