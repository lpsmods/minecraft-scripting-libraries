import unusedImports from "eslint-plugin-unused-imports";
import tsParser from "@typescript-eslint/parser";
import ts from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
    },
    plugins: {
      ts,
      "unused-imports": unusedImports,
    },
    rules: {
      "no-duplicate-imports": "error",
      "unused-imports/no-unused-imports": "error",
    },
  },
];
