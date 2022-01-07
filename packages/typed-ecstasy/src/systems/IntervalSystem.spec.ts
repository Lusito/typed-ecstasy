import { service, Engine, IntervalSystem } from "typed-ecstasy";

const deltaTime = 0.1;

@service()
class IntervalSystemSpy extends IntervalSystem {
    public numUpdates = 0;

    public constructor(engine: Engine) {
        super(engine, deltaTime * 2.0);
    }

    protected override updateInterval(): void {
        ++this.numUpdates;
    }
}

describe("IntervalSystem", () => {
    test("intervalSystem", () => {
        const engine = new Engine();
        const intervalSystemSpy = engine.systems.add(IntervalSystemSpy);

        for (let i = 1; i <= 10; ++i) {
            engine.update(deltaTime);
            expect(intervalSystemSpy.numUpdates).toBe(Math.floor(i / 2));
        }
    });

    test("testGetInterval", () => {
        const engine = new Engine();
        const intervalSystemSpy = engine.systems.add(IntervalSystemSpy);
        expect(intervalSystemSpy.getInterval()).toBe(deltaTime * 2.0);
    });
});
