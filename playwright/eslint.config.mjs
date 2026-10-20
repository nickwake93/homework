import typescript from "@typescript-eslint/eslint-plugin";
import playwright from "eslint-plugin-playwright";
import typescriptParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
const { configs: typescriptConfigs } = typescript;

export default [
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: {
      "@typescript-eslint": typescript,
      playwright: playwright,
      prettier: prettier,
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
      ...prettierConfig.rules,
      "prettier/prettier": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "no-console": "warn",
      ...playwright.configs["flat/recommended"].rules,
      "playwright/no-raw-locators": ["error", { allowed: ["html"] }],
      "playwright/valid-expect": "error",
      "playwright/prefer-web-first-assertions": "error",
      // Scope tests to browsers with testIgnore in playwright.config.ts, not test.skip.
      "playwright/no-skipped-test": "error",
      "playwright/expect-expect": "off", // We often use helper functions that contain the assertions
    },
  },
];
