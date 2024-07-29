const cds = require('@sap/cds')

module.exports = class AdminService extends cds.ApplicationService { init(){
  this.before (['NEW','CREATE'],'Authors', genid)
  this.before (['NEW','CREATE'],'Books', genid)
  return super.init()
}}

/** Generate primary keys for target entity in request */
async function genid (req) {
  if (req.data.ID) return
  const {id} = await SELECT.one.from(req.target).columns('max(ID) as id')
  req.data.ID = id + 4 // Note: that is not safe! ok for this sample only.
}
