// /* eslint-env node */
// module.exports = {
//     languageOptions: {
//       globals: {
//         require: "readonly",
//         module: "readonly",
//         exports: "writable",
//         process: "readonly",
//         console: "readonly",
//         setTimeout: "readonly",
//         setInterval: "readonly",
//         clearTimeout: "readonly",
//         clearInterval: "readonly"
//       },
//       ecmaVersion: 2022,
//       sourceType: "commonjs"
//     },
//     extends: [
//       "eslint:recommended",
//       "google"
//     ],
//     rules: {
//       "quotes": ["error", "double"],
//       "indent": ["error", 2],
//       "object-curly-spacing": ["error", "always"],
//       "max-len": ["error", { "code": 120 }],
//       "require-jsdoc": "off",
//       "valid-jsdoc": "off"
//     }
//   };


module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    "ecmaVersion": 12,
    "sourceType": "module"
  },
  rules: {
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "no-console": "off",
    "no-undef": "error"
  },
  globals: {
    "require": "readonly",
    "module": "readonly",
    "exports": "writable"
  }
};