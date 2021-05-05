const cds = require('@sap/cds');

module.exports = cds.service.impl(async function (srv) {
  const { A_BusinessPartner } = this.entities;

  srv.after('UPDATE', A_BusinessPartner, data => {
    console.log(`>>> BusinessPartner updated ${data.BusinessPartner}`);
    srv.emit("A_BusinessPartner.Changed", { businessPartners: [ data.BusinessPartner ] });
  });
});
