module.exports = {
    transform: {
        ".+\\.ts$": "ts-jest",
    },
    moduleNameMapper: {
        "typed-ecstasy": "<rootDir>/src",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
    setupFilesAfterEnv: ["./src/setupTests.ts"],
    moduleFileExtensions: ["ts", "js"],
    collectCoverage: true,
};
