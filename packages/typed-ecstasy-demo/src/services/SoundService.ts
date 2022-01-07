import { Engine, Family, PostConstruct, PreDestroy, service } from "typed-ecstasy";
import { SignalConnections } from "typed-signals";
import { SoundPlayer } from "sounts";

import { SoundComponent } from "../components/SoundComponent";
import { BallComponent } from "../components/BallComponent";

const soundFamily = Family.all(SoundComponent).get();
const ballFamily = Family.all(BallComponent).get();

@service({ hot: module.hot })
export class SoundService {
    private readonly engine: Engine;
    private readonly connections = new SignalConnections();
    private readonly player: SoundPlayer;

    public constructor(engine: Engine, audioContext: AudioContext) {
        this.engine = engine;
        this.player = new SoundPlayer(audioContext.destination);
    }

    public play(buffer: AudioBuffer) {
        this.player.play(buffer);
    }

    protected [PostConstruct]() {
        this.connections.add(
            this.engine.entities.onRemoveForFamily(soundFamily).connect((e) => {
                const sound = e.require(SoundComponent);
                if (sound.remove) this.player.play(sound.remove.buffer);
            })
        );
        this.connections.add(
            this.engine.entities.onAddForFamily(ballFamily).connect((e) => {
                const sound = e.require(SoundComponent);
                if (sound.create) this.player.play(sound.create.buffer);
            })
        );
    }

    protected [PreDestroy]() {
        this.connections.disconnectAll();
    }
}
