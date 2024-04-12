const globals = require("globals");
const js = require('@eslint/js');
const cds = require('@sap/eslint-plugin-cds');

module.exports = {
  {
    "files": ["**/*.js"],
    ...js.configs.recommended,
  "languageOptions": {
    "globals": {
      es2022: true,
      ...globals.browser,
      ...globals.node,
      ...globals.jest,
      ...globals.mocha
    }
  },
  "rules": {
    ...js.configs.recommended.rules,
    "no-console": "off",
    "require-atomic-updates": "off",
    "require-await": "warn",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "_" }]
  },
  {
    ...cds.configs.recommended,
    "files": ['*.cds', '**/*.cds'],
    "plugins": {
      "@sap/cds": cds
    },
    "languageOptions": {
      globals: cds.globals
    }
  }
}
