//
// Quick and dirty implementation for cds.validate()
// using db-level constraints.
//

const cds = require('@sap/cds')
cds.on('served', ()=> {

  const $ = cds.validate
  cds.validate = function (entity, key, ...columns) {

    if (entity?.ref) entity = { // quick and dirty
      name: entity.ref[0],
      constraints: { // even quicker and dirtier
        name: entity.ref[0] +'.constraints',
        keys: {ID:1}
      }
    }
    else if (!entity.is_entity) return // we skip all standard validations for the experiments
    else if (!entity.is_entity) return $(...arguments) // eslint-disable-line no-dupe-else-if

    if (entity.constraints) entity = entity.constraints
    if (!key) return key => cds.validate(entity,key)
    if (key.results) key = key.results[0].lastInsertRowid // quick and dirty
    if (key.ID) key = key.ID // quick and dirty

    return SELECT.one.from (entity, key, columns.length && columns) .then (checks => {
      const failed = {}; for (let c in checks) {
        if (c in entity.keys) continue
        if (c[0] == '_') continue
        if (checks[c]) failed[c] = checks[c]
      }
      if (Object.keys(failed).length) throw cds.error `Invalid input: ${failed}`
    })
  }

  const { AdminService } = cds.services
  AdminService.after (['CREATE','UPDATE'], (result,req) =>  cds.validate (req.subject, result))
})

Object.defineProperties (cds.entity.prototype, {
  constraints: { get() { return cds.model.definitions[this.name+'.constraints'] }},
  fields: { get() { return cds.model.definitions[this.name+'.field.control'] }},
})
