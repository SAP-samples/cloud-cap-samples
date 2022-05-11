import cds from '@sap/cds'
export default cds.service.impl((srv) => {
  srv.on('READ', 'me', ({ tenant, user, locale }) => ({ id: user.id, locale, tenant }))
})
