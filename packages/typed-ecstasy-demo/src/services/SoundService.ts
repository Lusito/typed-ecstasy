import { Engine, Family, PostConstruct, PreDestroy, service } from "typed-ecstasy";
import { SignalConnections } from "typed-signals";
import { SoundPlayer } from "sounts";

import { InputComponent } from "../components/InputComponent";
import { GameAudioContext } from "../types";
import { SoundComponent } from "../components/SoundComponent";

const soundFamily = Family.all(SoundComponent).exclude(InputComponent).get();

@service("game/SoundService", { hot: module.hot })
export class SoundService {
    private readonly engine: Engine;
    private readonly connections = new SignalConnections();
    private readonly player: SoundPlayer;

    public constructor(engine: Engine, audio: GameAudioContext) {
        this.engine = engine;
        this.player = new SoundPlayer(audio.audioContext.destination);
    }

    public play(buffer: AudioBuffer) {
        this.player.play(buffer);
    }

    protected [PostConstruct]() {
        this.connections.add(
            this.engine.entities.onRemoveForFamily(soundFamily).connect((e) => {
                const sound = e.require(SoundComponent);
                if (sound.removeSound) this.player.play(sound.removeSound);
            })
        );
    }

    protected [PreDestroy]() {
        this.connections.disconnectAll();
    }
}
