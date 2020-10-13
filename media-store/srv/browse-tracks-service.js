const cds = require("@sap/cds");

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service
  const { Invoices } = db.entities;

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

  this.on("READ", "Tracks", async (req, next) => {
    if (!!req._query && "my" in req._query) {
      const myTrackEntries = await db.run(
        SELECT.from(Invoices)
          .columns("ID")
          .where({ customer_ID: req.user.attr.ID })
      );
      const myTrackIdsSequence = myTrackEntries.map(({ ID }) => ID).join();
      const condition = cds.parse.expr(`ID in (${myTrackIdsSequence})`);
      const query = SELECT.from(req.query).where(condition);
      const result = await db.run(query);
      result.$count = result.length;
      return result;
    }
    return next();
  });
};
