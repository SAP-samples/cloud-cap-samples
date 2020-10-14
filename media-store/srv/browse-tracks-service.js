const cds = require("@sap/cds");

// only for demo cds.run(string, args)
const SELECT_INVOICES_BY_EMAIL = `
    select invoice.ID 
    from sap_capire_media_store_Invoices invoice
      join sap_capire_media_store_Customers customer 
        on customer.ID = invoice.customer_ID
      where customer.email=?
`;

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

  this.on("READ", "MarkedTracks", async (req) => {
    const myTrackIds = (
      await db.run(
        SELECT.from(Invoices)
          .columns("ID")
          .where({ customer_ID: req.user.attr.ID })
      )
    ).map(({ ID }) => ID);

    const result = await db.run(req.query);
    return result.map((columns) => {
      return {
        ...columns,
        alreadyOrdered: myTrackIds.includes(columns.ID),
      };
    });
  });
};
