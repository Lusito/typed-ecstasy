import { createDelayedOperations } from "typed-ecstasy";

describe("DelayedOperations", () => {
    const fnA = jest.fn();
    const fnB = jest.fn();
    const throwingFn = () => {
        throw new Error("Nope");
    };

    beforeEach(() => {
        fnA.mockReset();
        fnB.mockReset();
    });

    it("should provide current shouldDelay state", () => {
        const handler = createDelayedOperations({ fnA });
        expect(handler.shouldDelay).toBe(false);
        handler.shouldDelay = true;
        expect(handler.shouldDelay).toBe(true);
        handler.shouldDelay = false;
        expect(handler.shouldDelay).toBe(false);
    });

    describe("without delay", () => {
        it("should call the original instantly", () => {
            const handler = createDelayedOperations({ fnA });
            handler.fnA(1, "2", true);
            expect(fnA).toHaveBeenCalledTimes(1);
            expect(fnA).toHaveBeenCalledWith(1, "2", true);
            fnA.mockReset();
            handler.processDelayedOperations();
            expect(fnA).not.toHaveBeenCalled();
        });

        it("should throw if function throws", () => {
            const handler = createDelayedOperations({ throwingFn });
            expect(() => handler.throwingFn()).toThrow();
        });
    });

    describe("with delay", () => {
        it("should call during process()", () => {
            const handler = createDelayedOperations({ fnA });
            handler.shouldDelay = true;
            handler.fnA(1, "2", true);
            expect(fnA).not.toHaveBeenCalled();
            handler.processDelayedOperations();
            expect(fnA).toHaveBeenCalledTimes(1);
            expect(fnA).toHaveBeenCalledWith(1, "2", true);
            handler.processDelayedOperations();
            expect(fnA).toHaveBeenCalledTimes(1);
        });

        it("should handle multiple calls during process()", () => {
            const handler = createDelayedOperations({ fnA });
            handler.shouldDelay = true;
            handler.fnA(1, "2", true);
            handler.fnA(3, "4", false);
            expect(fnA).not.toHaveBeenCalled();
            handler.processDelayedOperations();
            expect(fnA).toHaveBeenCalledTimes(2);
            expect(fnA).toHaveBeenCalledWith(1, "2", true);
            expect(fnA).toHaveBeenCalledWith(3, "4", false);
            handler.processDelayedOperations();
            expect(fnA).toHaveBeenCalledTimes(2);
        });

        it("should handle multiple operations during process()", () => {
            const handler = createDelayedOperations({ fnA, fnB });
            handler.shouldDelay = true;
            handler.fnA(1, "2", true);
            handler.fnB(3, "4", false);
            expect(fnA).not.toHaveBeenCalled();
            expect(fnB).not.toHaveBeenCalled();
            handler.processDelayedOperations();
            expect(fnA).toHaveBeenCalledTimes(1);
            expect(fnA).toHaveBeenCalledWith(1, "2", true);
            expect(fnB).toHaveBeenCalledTimes(1);
            expect(fnB).toHaveBeenCalledWith(3, "4", false);
            handler.processDelayedOperations();
            expect(fnA).toHaveBeenCalledTimes(1);
            expect(fnB).toHaveBeenCalledTimes(1);
        });

        it("should throw if function throws", () => {
            const handler = createDelayedOperations({ throwingFn });
            handler.shouldDelay = true;
            handler.throwingFn();
            expect(() => handler.processDelayedOperations()).toThrow();
        });
    });
});
