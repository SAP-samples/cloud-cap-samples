const cds = require("@sap/cds");

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service

  this.before("*", (req) => {
    console.log(
      "[USER]:",
      req.user.id,
      " [LEVEL]: ",
      req.user.attr.level,
      "[ROLE]",
      req.user.is("user") ? "user" : "other"
    );
  });

  this.on("READ", "Invoices", async (req) => {
    return await db.run(req.query.where({ customer_ID: req.user.attr.ID }));
  });
};
