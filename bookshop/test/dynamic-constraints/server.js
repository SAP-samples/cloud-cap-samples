//
// Quick and dirty implementation for cds.validate()
// using db-level constraints.
//

const cds = require('@sap/cds'); require('./validate.js')
cds.on('served', ()=> {
  const { AdminService } = cds.services
  AdminService.after (['CREATE','UPDATE'], (result,req) =>  cds.validate (req.subject, result))
})



Object.defineProperties (cds.entity.prototype, {
  constraints: { get() { return cds.model.definitions[this.name+'.constraints'] }},
  fields: { get() { return cds.model.definitions[this.name+'.field.control'] }},
})
