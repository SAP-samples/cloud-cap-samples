const cds = require('@sap/cds');

module.exports = cds.service.impl(async function (srv) {
  const messaging = await cds.connect.to('messaging')
  const { A_BusinessPartner } = this.entities;

  srv.after('UPDATE', A_BusinessPartner, data => {
    console.log(`>>> BusinessPartner updated ${data.BusinessPartner}`);
    messaging.emit("BusinessPartners/Changed", { businessPartners: [ data.BusinessPartner ] });
  });
});
