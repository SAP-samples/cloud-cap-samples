const cds = require('@sap/cds')

module.exports = cds.service.impl (async function() {
  const {Books} = cds.entities
  const {ID} = await SELECT.one.from(Books).columns('max(ID) as ID')
  let newID = ID - ID % 100 + 100
  this.before ('NEW','Books', req => req.data.ID = ++newID)
})
