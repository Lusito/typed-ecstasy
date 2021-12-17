import { ComponentBlueprint } from "typed-ecstasy";

import { PositionComponent } from "../../sample/components/PositionComponent";
import { SpriteComponent } from "../../sample/components/SpriteComponent";
import { PickupComponent } from "../../sample/components/PickupComponent";
import { CameraFocusComponent } from "../../sample/components/CameraFocusComponent";
import { setupEntityFactory } from "../../sample/entityFactory";

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
