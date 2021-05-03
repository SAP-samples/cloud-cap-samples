const cds = require('@sap/cds');

module.exports = cds.service.impl(function (srv) {
  const { A_BusinessPartner } = this.entities;

  srv.after('UPDATE', A_BusinessPartner, data => {
    console.log(`>>> BusinessPartner updated ${data.BusinessPartner}`);
    srv.emit("BusinessPartners/Changed", { businessPartners: [ data.BusinessPartner ] });
  });
});
