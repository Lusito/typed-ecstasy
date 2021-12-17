import { declareComponent } from "typed-ecstasy";

// Check out CameraFocusComponent for a more detailed explanation of how to declare components
export type PickupData = {
    componentType: "Pickup";
    material: "stone" | "wood";
    amount: number;
};

export type PickupConfig = {
    material: "stone" | "wood";
    amount: number;
};

export const PickupComponent = declareComponent("Pickup").withConfig<PickupData, PickupConfig>({
    build(comp, config) {
        comp.material = config("material", "wood");
        comp.amount = config("amount", 1);
    },
});
