import { FlatCompat } from "@eslint/eslintrc";
import ts from "typescript-eslint";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/** @type { import("eslint").Linter.Config[] } */
const eslintConfig = [
  {
    ignores: ["**/node_modules/**", "**/dist/**", "**/.next/**"],
  },

  // Use the compat config for Next.js + Prettier
  ...compat.config({
    extends: ["plugin:@next/next/recommended", "prettier"],
  }),

  ...ts.configs.recommended,

  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },

  // Add native flat config block for TypeScript
  ...ts.config({
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: ts.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  }),
];

export default eslintConfig;
