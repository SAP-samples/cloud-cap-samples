const cds = require('@sap/cds')
module.exports = cds.service.impl((srv) => {
  srv.on('READ', 'me', ({ tenant, user, locale }) => ({ id: user.id, locale, tenant }))
})
