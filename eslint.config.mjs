import typescript from "@typescript-eslint/eslint-plugin";
import playwright from "eslint-plugin-playwright";
import typescriptParser from "@typescript-eslint/parser";
const { configs: typescriptConfigs } = typescript;

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescript,
      playwright: playwright,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    rules: {
      ...typescriptConfigs.recommended.rules,
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "no-console": "warn",
      ...playwright.configs["flat/recommended"].rules,
      // "playwright/no-raw-locators": "warn", // We should enable this when fixed
      "playwright/valid-expect": "error",
      "playwright/prefer-web-first-assertions": "error",
      "playwright/expect-expect": "off", // We often use helper functions that contain the assertions
    },
  },
];