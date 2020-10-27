const cds = require("@sap/cds");

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service
  const { Invoices, InvoiceItems } = db.entities;

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

  this.on("READ", "MyInvoices", async (req) => {
    return await db.run(req.query.where({ customer_ID: req.user.attr.ID }));
  });

  this.on("invoice", async (req) => {
    const { tracks } = req.data;
    const customerId = req.user.attr.ID;
    const total = tracks.reduce(
      (acc, { unitPrice }) => acc + Number(unitPrice),
      0
    );

    const { ID: lastInvoiceItemId } = await db.run(
      SELECT.one(InvoiceItems).columns("ID").orderBy({ ID: "desc" })
    );
    const { ID: lastInvoiceId } = await db.run(
      SELECT.one(Invoices).columns("ID").orderBy({ ID: "desc" })
    );

    const transaction = await db.tx(req);
    await transaction.run(
      INSERT.into(Invoices)
        .columns("ID", "customer_ID", "total")
        .values(lastInvoiceId + 1, customerId, total)
    );
    await transaction.run(
      INSERT.into(InvoiceItems)
        .columns("ID", "invoice_ID", "track_ID", "unitPrice")
        .rows(
          tracks.map(({ ID, unitPrice }, index) => [
            lastInvoiceItemId + (index + 1),
            lastInvoiceId + 1,
            ID,
            unitPrice,
          ])
        )
    );
    await transaction.commit();
  });
};
