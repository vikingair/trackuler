// @ts-check

import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import prettier from "eslint-plugin-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImpSort from "eslint-plugin-simple-import-sort";
import tseslint from "typescript-eslint";

export default defineConfig(
  globalIgnores(["node_modules", "build"]),
  {
    files: ["**/*.{j,t}s?(x)"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      prettier,
      "simple-import-sort": simpleImpSort,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "prettier/prettier": "warn",
      "arrow-body-style": ["warn", "as-needed"],
      "no-console": "warn",
      eqeqeq: ["error", "always"],
      "simple-import-sort/imports": [
        "warn",
        {
          groups: [
            [
              "vitest",
              // scss and css file imports
              "\\.s?css$",
              // side effect (e.g. `import "./foo"`)
              "^\\u0000",
              // NodeJS internals "node:"
              "^node:",
              // every import starting with "react"
              "^react",
              // things that start with a letter (or digit or underscore), or `@` followed by a letter
              "^@?\\w",
              // internal relative paths
              "^\\.",
            ],
          ],
        },
      ],
      "simple-import-sort/exports": "warn",
      "no-restricted-imports": [
        "error",
        {
          patterns: ["**/build/*", "**/dist/*"],
        },
      ],
      "no-duplicate-imports": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/*.d.ts"],
    rules: {
      "no-var": "off",
    },
  },
  {
    files: ["**/*.test.ts?(x)"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
);
