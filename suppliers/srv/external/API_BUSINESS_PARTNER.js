const cds = require('@sap/cds');

module.exports = cds.service.impl(function () {
  const { A_BusinessPartner } = this.entities;

  // TODO: Take over the original S/4 event definition
  this.after('UPDATE', A_BusinessPartner, async data => {
    console.log(`>>> BusinessPartner updated ${data.BusinessPartner}`);
    await this.emit("A_BusinessPartner.Changed", { businessPartners: [ data.BusinessPartner ] });
  });
});
