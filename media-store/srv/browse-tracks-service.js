const cds = require("@sap/cds");

const selectInvoicedTracksByEmail = (email) => `
        select
            tracks.ID,
            tracks.name trackName,
            tracks.composer,
            tracks.unitPrice,
            genre.name genreName,
            album.title albumTitle
            
        from sap_capire_media_store_Tracks tracks
        join sap_capire_media_store_InvoiceItems invoiceItem
            on invoiceItem.track_ID = tracks.ID
        join sap_capire_media_store_Invoices invoice
            on invoice.ID = invoiceItem.invoice_ID
        join sap_capire_media_store_Customers customer
            on customer.ID = invoice.customer_ID
        join sap_capire_media_store_Genres genre
            on genre.ID = tracks.genre_ID
        join sap_capire_media_store_Albums album
            on album.ID = tracks.album_ID
        where
            customer.email = '${email}'
`;

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service

  // this.before("*", (req) => {
  //   req.user = new Buyer();
  // });

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

  this.on("getInvoicedTracks", async (req) => {
    const user = req.user;
    user.is("user") || req.reject(403);
    const query = cds.parse.cql(selectInvoicedTracksByEmail(user.attr.email));
    return await db.run(query);
  });
};
