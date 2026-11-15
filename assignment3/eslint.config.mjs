import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";

export default tseslint.config(
    {
        ignores: [
            "**/dist/*",
            "**coverage/*",
            "**.github/*",
            "eslint.config.mjs",
            "jest.config.ts",
            "jest.config.js",
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        files: ["./**/*.ts", "./**/*.tsx"],
    },
    {
        rules: {
            // Require return types on functions
            "@typescript-eslint/explicit-function-return-type": "error",
            // Disallow unused variables (allow ones starting with _)
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "^_" },
            ],
            // Require types on parameters, properties and variables
            "@typescript-eslint/typedef": [
                "error",
                {
                    parameter: true,
                    propertyDeclaration: true,
                    variableDeclaration: true,
                    memberVariableDeclaration: true,
                    variableDeclarationIgnoreFunction: true,
                },
            ],
            // Allow require() imports
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-var-requires": "off",
        },
    }
);