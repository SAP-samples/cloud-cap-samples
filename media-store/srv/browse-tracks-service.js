const cds = require("@sap/cds");

const selectTracksByEmail = (email) => `
    select tracks.ID
    from sap_capire_media_store_Tracks tracks
      join sap_capire_media_store_Invoices invoices 
        on tracks.ID = invoiceItems.track_ID 
      join sap_capire_media_store_InvoiceItems invoiceItems 
        on invoices.ID = invoiceItems.invoice_ID  
      join sap_capire_media_store_Customers customers 
        on customers.ID = invoices.customer_ID
      where (customers.email='${email}' and invoices.status='2') 
        or (customers.email='${email}' and invoices.status='1')
`;

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service

  // this.before("READ", "MarkedTracks", (req) => {
  //   if (!req.user.is("customer")) {
  //     req.reject(403);
  //   }
  // });

  this.on("READ", "MarkedTracks", async (req) => {
    const myTrackIds = (await db.run(selectTracksByEmail(req.user.id))).map(
      ({ ID }) => ID
    );
    const result = [];
    await db.foreach(req.query, (track) => {
      result.push({
        ...track,
        alreadyOrdered: myTrackIds.includes(track.ID),
      });
    });
    return result;
  });
};
