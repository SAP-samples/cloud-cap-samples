const cds = require("@sap/cds");
const moment = require("moment");

const LEVERAGE_DURATION = 1; // in hours. should be the same in the frontend
const CANCEL_STATUS = -1;

// the same function there is in the frontend
const isLeverageTimeExpired = (invoiceDate) => {
  const duration = moment.duration(
    moment(moment().utc().format()).diff(invoiceDate)
  );
  return duration.asHours() > LEVERAGE_DURATION;
};

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service
  const { Invoices, InvoiceItems } = db.entities;

  // this.before("*", (req) => {
  //   if (!req.user.is("customer")) {
  //     req.reject(403);
  //   }
  // });

  this.on("READ", "Invoices", async (req) => {
    return await db.run(req.query.where({ customer_ID: req.user.attr.ID }));
  });

  this.on("invoice", async (req) => {
    const { tracks } = req.data;
    const customerId = req.user.attr.ID;
    const invoiceDate = moment().utc().valueOf();
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
        .columns("ID", "customer_ID", "total", "invoiceDate")
        .values(lastInvoiceId + 1, customerId, total, invoiceDate)
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

    if (isLeverageTimeExpired(currentInvoice.invoiceDate)) {
      req.reject(400, "Leverage time was expired");
    }

    return await db.run(
      UPDATE(Invoices).set({ status: CANCEL_STATUS }).where({ ID })
    );
  });
};
