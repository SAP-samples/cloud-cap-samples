const globals = require("globals");
const js = require('@eslint/js');
const cds = require('@sap/eslint-plugin-cds');

module.exports = {
  "files": ["**/*.js"],
  ...js.configs.recommended,
  "languageOptions": {
    "globals": {
      ...globals.browser,
      ...globals.node,
      ...globals.jest,
      ...globals.mocha,
      "es2022": true
  },
  "rules": {
    ...js.configs.recommended.rules,
    "no-console": "off",
    "require-atomic-updates": "off",
    "require-await": "warn",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "_" }]
  }
},
{ 
  "files": ['**/*.cds', '**/*.csn', '**/*.csv'],
  ...cds.configs.recommended,
  "plugins": {
    "@sap/cds": cds
  },
  "languageOptions": {
    globals: {
      ...cds.globals
    }
  }
}
