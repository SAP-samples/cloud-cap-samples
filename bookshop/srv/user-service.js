const cds = require('@sap/cds');

module.exports = cds.service.impl((srv) => {
  srv.on('READ', 'Me', ({ user }) => {
    return {
      ID: user.id,
      locale: user.locale,
      tenant: user.tenant,
    };
  });
});
