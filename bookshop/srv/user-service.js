const cds = require('@sap/cds');

module.exports = cds.service.impl((srv) => {
  srv.on('READ', 'User', ({ user }) => {
    return {
      ID: user.id,
      locale: user.locale,
      tenant: user.tenant,
    };
  });
});
