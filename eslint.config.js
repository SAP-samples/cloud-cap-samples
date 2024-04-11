const js = require('@eslint/js');
const cds = require('@sap/eslint-plugin-cds');

module.exports = {
  {
    "files": ["*.js"],
    ...js.configs.recommended,
  "rules": {
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
    "languageOptions": cds.globals,
    "rules": {
      "@sap/cds/min-node-version": 0,
      "@sap/cds/start-elements-lowercase": 1,
      "@sap/cds/start-entities-uppercase": 1
    }
  }
}
