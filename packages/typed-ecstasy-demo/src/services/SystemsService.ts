import { Engine, PostConstruct, PreDestroy, service } from "typed-ecstasy";

import { MovementSystem } from "../systems/MovementSystem";
import { RenderSystem } from "../systems/RenderSystem";
import { InputSystem } from "../systems/InputSystem";

@service({ hot: module.hot })
export class SystemsService {
    private readonly engine: Engine;

    public constructor(engine: Engine) {
        this.engine = engine;
    }

    protected [PostConstruct]() {
        // Having this logic in a system allows us to easily add or remove systems during development:
        // fixme: If engine would remove systems from container as well, then retainable wouldn't work with this approach
        // fixme: Would it be possible to just set an array of systems here, so they don't have to be removed and re-added?
        this.engine.systems.add(MovementSystem);
        this.engine.systems.add(RenderSystem);
        this.engine.systems.add(InputSystem);
    }

    protected [PreDestroy]() {
        this.engine.systems.removeAll();
    }
}
