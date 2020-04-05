module.exports = {
    extends: ["@lusito/eslint-config"],
    rules: {
        "no-bitwise": "off",
    },
    overrides: [
        {
            files: ["*.spec.{ts,tsx}", "src/testUtils.ts"],
            rules: {
                "max-classes-per-file": "off",
            },
        },
    ],
};
