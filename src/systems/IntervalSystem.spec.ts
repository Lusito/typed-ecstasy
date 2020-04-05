import { Engine } from "../core/Engine";
import { IntervalSystem } from "./IntervalSystem";

const deltaTime = 0.1;

class IntervalSystemSpy extends IntervalSystem {
    public numUpdates = 0;

    public constructor(priority?: number) {
        super(deltaTime * 2.0, priority);
    }

    protected updateInterval(): void {
        ++this.numUpdates;
    }
}

describe("IntervalSystem", () => {
    test("priority", () => {
        let system = new IntervalSystemSpy();
        expect(system.getPriority()).toBe(0);
        system = new IntervalSystemSpy(10);
        expect(system.getPriority()).toBe(10);
        system.setPriority(13);
        expect(system.getPriority()).toBe(13);
    });

    test("intervalSystem", () => {
        const engine = new Engine();
        const intervalSystemSpy = engine.addSystem(new IntervalSystemSpy());

        for (let i = 1; i <= 10; ++i) {
            engine.update(deltaTime);
            expect(intervalSystemSpy.numUpdates).toBe(Math.floor(i / 2));
        }
        engine.destroy();
    });

    test("testGetInterval", () => {
        const intervalSystemSpy = new IntervalSystemSpy();
        expect(intervalSystemSpy.getInterval()).toBe(deltaTime * 2.0);
    });
});
