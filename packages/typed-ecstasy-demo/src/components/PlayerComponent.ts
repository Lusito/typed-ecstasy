import { declareComponent } from "typed-ecstasy";

// Check out CameraFocusComponent for a more detailed explanation of how to declare components
export type PlayerData = {
    remainingBalls: number;
    score: number;
};

export type PlayerConfig = {
    remainingBalls: number;
};

export const PlayerComponent = declareComponent("Player").withConfig<PlayerData, PlayerConfig>({
    build(comp, config) {
        comp.remainingBalls = config("remainingBalls", 1);
        comp.score = 0;
    },
});
