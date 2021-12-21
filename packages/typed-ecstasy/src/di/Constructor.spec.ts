import { getConstructorName } from "./Constructor";

describe("getConstructorName", () => {
    it("should return the name attribute if provided", () => {
        // eslint-disable-next-line prefer-arrow-callback
        expect(getConstructorName(function Test() {})).toBe("Test");
    });

    it("should return a stringified version if no name attribute is provided", () => {
        expect(
            // eslint-disable-next-line prefer-arrow-callback, func-names
            getConstructorName(function () {
                return "test";
            })
        ).toMatch(/function \(\) {\s+return "test";\s+}/);
    });
});
