const cds = require("@sap/cds");

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service

  const { Invoices, InvoiceItems } = db.entities;

  this.on("READ", "MarkedTracks", async (req) => {
    const invoiceItemEntries = await db.run(
      SELECT.from(InvoiceItems)
        .columns("track_ID")
        .where(
          "invoice_ID in",
          SELECT("ID").from(Invoices).where({
            customer_ID: req.user.attr.ID,
          })
        )
    );
    const trackIds = invoiceItemEntries.map(({ track_ID }) => track_ID);

    const result = [];
    await db.foreach(req.query, (track) => {
      result.push({
        ...track,
        alreadyOrdered: trackIds.includes(track.ID),
      });
    });
    return result;
  });
};
