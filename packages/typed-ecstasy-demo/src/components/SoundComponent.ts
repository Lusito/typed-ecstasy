import { declareComponent } from "typed-ecstasy";

import { GameAudioContext } from "../types";

// Check out CameraFocusComponent for a more detailed explanation of how to declare components
export type SoundData = {
    removeSound?: AudioBuffer;
    hitSound?: AudioBuffer;
};

export type SoundConfig = {
    removeSound?: keyof GameAudioContext["sounds"] | null;
    hitSound?: keyof GameAudioContext["sounds"] | null;
};

export const SoundComponent = declareComponent("Sound").withConfig<SoundData, SoundConfig>((container) => {
    const { sounds } = container.get(GameAudioContext);
    return {
        build(comp, config) {
            const removeSound = config("removeSound", null);
            comp.removeSound = removeSound ? sounds[removeSound] : undefined;
            const hitSound = config("hitSound", null);
            comp.hitSound = hitSound ? sounds[hitSound] : undefined;
        },
    };
});
