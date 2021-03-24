const cds = require("@sap/cds");

const SHIPPED_STATUS = 1;

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service

  const { Invoices, InvoiceItems } = db.entities;

  this.on("READ", "MarkedTracks", async (req, next) => {
    const [ID] = req.params;
    const customerID = req.user.attr.ID;

    // REVISIT: joins are not supported in Node.js runtime
    const invoiceItemEntries = await db.run(
      SELECT.from(InvoiceItems)
        .columns("track_ID")
        .where(
          "invoice_ID in",
          SELECT("ID").from(Invoices).where({
            customer_ID: customerID,
            status: SHIPPED_STATUS,
          })
        )
    );
    const trackIds = invoiceItemEntries.map(({ track_ID }) => track_ID);

    // if retrieving only one track
    if (ID) {
      const track = await next();

      return {
        ...track,
        alreadyOrdered: trackIds.includes(track.ID),
      };
    } else {
      // if retrieving list of tracks
      const result = [];
      await db.foreach(req.query, (track) => {
        result.push({
          ...track,
          alreadyOrdered: trackIds.includes(track.ID),
        });
      });
      return result;
    }
  });
};
