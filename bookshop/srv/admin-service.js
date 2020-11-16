const cds = require('@sap/cds')

module.exports = cds.service.impl (function(){
  this.before ('NEW','Authors', genid)
  this.before ('NEW','Books', genid)
})

/** Generate primary keys for target entity in request */
async function genid (req) {
  const {ID} = await cds.tx(req).run (SELECT.one.from(req.target).columns('max(ID) as ID'))
  req.data.ID = ID - ID % 100 + 100 + 1
}
