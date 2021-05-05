const cds = require('@sap/cds');

module.exports = cds.service.impl(function () {
  const { A_BusinessPartner } = this.entities;

  // https://api.sap.com/event/SAPS4HANACloudBusinessEvents_BusinessPartner/resource
  this.after('UPDATE', A_BusinessPartner, async data => {
    console.log(`>>> BusinessPartner updated ${data.BusinessPartner}`);
    await this.emit("BusinessPartner.Changed", { BusinessPartner: data.BusinessPartner });
  });
});
