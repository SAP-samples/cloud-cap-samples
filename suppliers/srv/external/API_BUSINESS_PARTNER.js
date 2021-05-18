const cds = require("@sap/cds");

module.exports = cds.service.impl(function () {
  const { A_BusinessPartner } = this.entities;

  this.after("UPDATE", A_BusinessPartner, (data, req) =>
    this.tx(req).emit("BusinessPartner.Changed", {
      BusinessPartner: data.BusinessPartner
    })
  );
});
