/* eslint-disable dot-notation */
import { AbstractSystem } from "typed-ecstasy";

class TestSystem extends AbstractSystem<TestSystem> {}

describe("AbstractSystem", () => {
    const system = new TestSystem();
    const onEnableSpy = jest.fn();
    const onDisableSpy = jest.fn();
    system["onEnable"] = onEnableSpy;
    system["onDisable"] = onDisableSpy;

    beforeEach(() => {
        onEnableSpy.mockReset();
        onDisableSpy.mockReset();
    });

    describe("with manager", () => {
        beforeEach(() => {
            system["manager"] = {} as any;
        });

        test("#setEnabled() should call onEnable/onDisable when switching enabled state", () => {
            expect(onEnableSpy).not.toHaveBeenCalled();
            expect(onDisableSpy).not.toHaveBeenCalled();

            // Enabled by default, so setting it to true should not do anything
            system.setEnabled(true);
            expect(onEnableSpy).not.toHaveBeenCalled();
            expect(onDisableSpy).not.toHaveBeenCalled();

            // Switch to disabled
            system.setEnabled(false);
            expect(onEnableSpy).not.toHaveBeenCalled();
            expect(onDisableSpy).toHaveBeenCalledWith();

            // Nothing changes here
            onDisableSpy.mockReset();
            system.setEnabled(false);
            expect(onEnableSpy).not.toHaveBeenCalled();
            expect(onDisableSpy).not.toHaveBeenCalled();

            // Switch to enabled
            system.setEnabled(true);
            expect(onEnableSpy).toHaveBeenCalledWith();
            expect(onDisableSpy).not.toHaveBeenCalled();
        });

        test("#setEnabled() should change enabled state", () => {
            expect(system.isEnabled()).toBe(true);
            system.setEnabled(true);
            expect(system.isEnabled()).toBe(true);
            system.setEnabled(false);
            expect(system.isEnabled()).toBe(false);
            system.setEnabled(true);
            expect(system.isEnabled()).toBe(true);
        });
    });

    describe("without manager", () => {
        beforeEach(() => {
            system["manager"] = null;
        });

        test("#setEnabled() should not call onEnable/onDisable when switching enabled state", () => {
            expect(onEnableSpy).not.toHaveBeenCalled();
            expect(onDisableSpy).not.toHaveBeenCalled();

            system.setEnabled(true);
            system.setEnabled(false);
            system.setEnabled(true);
            expect(onEnableSpy).not.toHaveBeenCalled();
            expect(onDisableSpy).not.toHaveBeenCalled();
        });

        test("#setEnabled() should change enabled state", () => {
            expect(system.isEnabled()).toBe(true);
            system.setEnabled(true);
            expect(system.isEnabled()).toBe(true);
            system.setEnabled(false);
            expect(system.isEnabled()).toBe(false);
            system.setEnabled(true);
            expect(system.isEnabled()).toBe(true);
        });
    });
});
