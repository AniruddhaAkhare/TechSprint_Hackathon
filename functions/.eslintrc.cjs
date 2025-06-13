/* eslint-disable */

module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: ["eslint:recommended", "google"],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module", // default (for .js)
  },
  rules: {
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "no-console": "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "require-jsdoc": "off",
    "max-len": ["error", { code: 120 }],
  },
  overrides: [
    {
      files: ["**/*.spec.js"],
      env: {
        mocha: true,
      },
    },
    {
      files: ["**/*.cjs"],
      parserOptions: {
        sourceType: "script", // 👈 treat .cjs files as CommonJS
      },
      env: {
        node: true,
      },
    },
  ],
};
