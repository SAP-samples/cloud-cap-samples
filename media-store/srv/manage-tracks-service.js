const cds = require("@sap/cds");

module.exports = async function () {
  this.before("*", async (req) => {
    req.user.locale = "fr";
  });
};
