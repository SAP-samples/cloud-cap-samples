//
//  Quick and dirty implementation for cds.validate() using db-level constraints
//  Test in cds.repl like that:
//  await cds.run (()=> INSERT.into (Books, { title:'   ', author_ID:150 }) .then (cds.validate(Books)))
//

const cds = require('@sap/cds')
cds.on('served', ()=> {

  const $ = cds.validate; cds.validate = function (entity, key, ...columns) {

    if (!entity.is_entity) return $(...arguments)
    if (!key) return key => cds.validate(entity,key)

    if (entity.constraints) entity = entity.constraints
    if (key.results) key = key.results[0].lastInsertRowid

    return SELECT.one.from (entity, key, columns.length && columns) .then (checks => {
      const failed = {}; for (let c in checks) {
        if (c in entity.keys) continue
        if (c[0] == '_') continue
        if (checks[c]) failed[c] = checks[c]
      }
      if (Object.keys(failed).length) throw cds.error `Invalid input: ${failed}`
    })
  }

})

Object.defineProperties (cds.entity.prototype, {
  constraints: { get() { return cds.model.definitions[this.name+'.constraints'] }},
  fields: { get() { return cds.model.definitions[this.name+'.field.control'] }},
})
