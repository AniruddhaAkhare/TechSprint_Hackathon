module.exports = {
  root: true,
  env: {
    node: true,    // Enables Node.js global variables
    es2022: true,
  },
  extends: [
    "eslint:recommended",
    "google"
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module"
  },
  rules: {
    "quotes": ["error", "double", { "allowTemplateLiterals": true }],
    "no-console": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }], // Allow unused parameters if prefixed with _
    "require-jsdoc": "off",
    "max-len": ["error", { "code": 120 }]
  },
  overrides: [
    {
      files: ["**/*.spec.js"],
      env: {
        mocha: true
      }
    }
  ]
};