const cds = require("@sap/cds");

const s4apiKey = process.env.S4_APIKEY;
if (!s4apiKey && cds.env.profiles.indexOf("sandbox") >= 0) {
  console.error(
    "[ERROR] Provide API Key in env var S4_APIKEY for S/4 Sandbox: https://api.sap.com/api/API_BUSINESS_PARTNER/resource -> Show API Key"
  );
  process.exit(1);
}

module.exports = cds.service.impl(async function () {
  const { Notes, Suppliers } = this.entities;

  const bpService = await cds.connect.to("API_BUSINESS_PARTNER");

  // REVISIT: This is a workaround for the missing capability to add headers to the service
  const bpServiceDelegate = {
    run: query => bpService.send({ query, headers: { APIKey: s4apiKey } })
  };

  // Suppliers?$expand=notes
  this.on("READ", Suppliers, async (req, next) => {
    const expandIndex = req.query.SELECT.columns.findIndex(
      ({ expand, ref }) => expand && ref[0] === "notes"
    );
    if (expandIndex < 0) return next();

    req.query.SELECT.columns.splice(expandIndex, 1);
    if (!req.query.SELECT.columns.find(
            column => column.ref.find((ref) => ref == "ID"))
       )
      req.query.SELECT.columns.push({ ref: ["ID"] });

    const suppliers = await next();

    // Request all associated notes
    const supplierIds = suppliers.map((supplier) => supplier.ID);
    const notes = await this.run(SELECT.from(Notes).where({ supplier_ID: supplierIds }));

    // Convert in a map for easier lookup
    const notesForSuppliers = {};
    for (const note of notes) {
      if (!notesForSuppliers[note.supplier_ID]) notesForSuppliers[note.supplier_ID] = [];
      notesForSuppliers[note.supplier_ID].push(note);
    }

    // Add notes to result
    for (const supplier of suppliers) {
      const notesForSupplier = notesForSuppliers[supplier.ID];
      if (notesForSupplier) supplier.notes = notesForSupplier;
    }

    return suppliers;
  });


  this.on("READ", Suppliers, async req => {
    return bpServiceDelegate.run(req.query);
  });

});
