module.exports = {
    plugins: ["jsdoc"],
    extends: ["@lusito/eslint-config", "plugin:jest/recommended", "plugin:jsdoc/recommended"],
    rules: {
        "import/no-unresolved": ["error", { ignore: ["typed-ecstasy"] }],
        "no-bitwise": "off",
        "jest/no-conditional-expect": "off",
        "lines-between-class-members": "off",
        "@typescript-eslint/lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
        "@typescript-eslint/explicit-member-accessibility": ["error"],
        "jsdoc/require-param-type": "off",
        "jsdoc/require-returns-type": "off",
        "jsdoc/no-types": "warn",
        "jsdoc/require-asterisk-prefix": "warn",
        "jsdoc/require-throws": "warn",
        "jsdoc/require-jsdoc": [
            "warn",
            {
                publicOnly: {
                    ancestorsOnly: true,
                    esm: true,
                    cjs: true,
                    window: false,
                },
                require: {
                    ArrowFunctionExpression: true,
                    ClassDeclaration: true,
                    ClassExpression: true,
                    FunctionDeclaration: true,
                    FunctionExpression: true,
                    MethodDefinition: false,
                },
                contexts: ['MethodDefinition:not([accessibility="private"]):not([override=true]) > FunctionExpression'],
            },
        ],
        "jsdoc/check-tag-names": ["warn", { definedTags: ["internal"] }],
        "jsdoc/require-description-complete-sentence": ["warn", { tags: ["template"], abbreviations: ["i.e."] }],
    },
    settings: {
        jsdoc: {
            ignorePrivate: true,
        },
    },
    overrides: [
        {
            files: ["packages/typed-ecstasy-demo/**/*.*"],
            rules: {
                "jsdoc/require-jsdoc": "off",
            },
        },
        {
            files: ["*.spec.ts", "src/testUtils.ts"],
            rules: {
                "max-classes-per-file": "off",
                "import/no-extraneous-dependencies": "off",
            },
        },
    ],
    env: {
        "jest/globals": true,
    },
};
