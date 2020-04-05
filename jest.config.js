module.exports = {
    transform: {
        ".+\\.ts$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts$",
    setupFilesAfterEnv: ["./src/setupTests.ts"],
    moduleFileExtensions: ["ts", "js"],
    collectCoverage: true,
};
