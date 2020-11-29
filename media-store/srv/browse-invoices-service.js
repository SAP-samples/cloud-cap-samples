const cds = require("@sap/cds");
const moment = require("moment");

const LEVERAGE_DURATION = 1; // in hours. should be the same in the frontend
const CANCEL_STATUS = -1;
const SHIPPED_STATUS = 1;
const UTC_DATE_TIME_FORMAT = "YYYY-MM-DDThh:mm:ss";

// the same function there is in the frontend
const isLeverageTimeExpired = (utcNowTimestamp, invoiceDate) => {
  const duration = moment.duration(
    moment(utcNowTimestamp).diff(moment(invoiceDate).valueOf())
  );
  return duration.asHours() > LEVERAGE_DURATION;
};

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service
  const { Invoices, InvoiceItems } = db.entities;

  this.on("READ", "Invoices", async (req) => {
    return await db.run(req.query.where({ customer_ID: req.user.attr.ID }));
  });

  this.on("invoice", async (req) => {
    const { tracks } = req.data;
    const newInvoicedTracks = tracks.map(({ ID }) => ID);
    const customerId = req.user.attr.ID;
    const utcNowDateTime = moment().utc().format(UTC_DATE_TIME_FORMAT);
    const total = tracks.reduce(
      (acc, { unitPrice }) => acc + Number(unitPrice),
      0
    );

    const transaction = await db.tx(req);
    // check if already exists
    const invoicedTracks = await transaction.run(
      SELECT.from(InvoiceItems)
        .columns("track_ID")
        .where(
          "invoice_ID in",
          SELECT("ID").from(Invoices).where({
            customer_ID: req.user.attr.ID,
            status: SHIPPED_STATUS,
          })
        )
    );
    const isNewInvoiceHasInvoicedTracks = invoicedTracks.some(
      ({ track_ID: curID }) => newInvoicedTracks.includes(curID)
    );
    if (isNewInvoiceHasInvoicedTracks) {
      req.reject(400, "Invoice contains already owned values");
    }

    // getting last ids for new records
    let { ID: lastInvoiceId } = await transaction.run(
      SELECT.one(Invoices).columns("ID").orderBy({ ID: "desc" })
    );
    let { ID: lastInvoiceItemId } = await transaction.run(
      SELECT.one(InvoiceItems).columns("ID").orderBy({ ID: "desc" })
    );

    // creating invoice
    const newInvoiceId = ++lastInvoiceId;
    await transaction.run(
      INSERT.into(Invoices)
        .columns("ID", "customer_ID", "total", "invoiceDate")
        .values(newInvoiceId, customerId, total, utcNowDateTime)
    );

    // creating invoice items
    await transaction.run(
      INSERT.into(InvoiceItems)
        .columns("ID", "invoice_ID", "track_ID", "unitPrice")
        .rows(
          tracks.map(({ ID: trackID, unitPrice }, index) => [
            lastInvoiceItemId + index + 1,
            newInvoiceId,
            trackID,
            unitPrice,
          ])
        )
    );
    await transaction.commit();
  });

  this.on("cancelInvoice", async (req) => {
    const { ID } = req.data;

    const currentInvoice = await db.run(
      SELECT.one(Invoices)
        .where({
          ID,
          customer_ID: req.user.attr.ID,
        })
        .columns("ID", "invoiceDate", "customer_ID")
    );
    if (!currentInvoice) {
      req.reject(
        404,
        "Seems like you are not owning this invoice or it is not exists"
      );
    }

    const utcNowTimestamp = moment(
      moment().utc().format(UTC_DATE_TIME_FORMAT)
    ).valueOf();
    if (isLeverageTimeExpired(utcNowTimestamp, currentInvoice.invoiceDate)) {
      req.reject(400, "Leverage time was expired");
    }

    return await db.run(
      UPDATE(Invoices).set({ status: CANCEL_STATUS }).where({ ID })
    );
  });
};
