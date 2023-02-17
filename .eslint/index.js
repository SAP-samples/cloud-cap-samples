const cds = require("@sap/eslint-plugin-cds");

module.exports = {
  configs: {
    recommended: {
      plugins: ["cloud-cap-samples"],
      rules: {
        "cloud-cap-samples/no-open-services": ["error", "show"]
      }
    }
  },
  rules: {
    "no-open-services": cds.createRule(require("./rules/no-open-services")),
  }
};
