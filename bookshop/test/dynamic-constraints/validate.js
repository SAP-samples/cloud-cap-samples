const cds = require('@sap/cds')
const $super = { validate: cds.validate, skip(){} }


/**
 * Quick and dirty implementation for cds.validate() using db-level constraints.
 */
cds.validate = function (x, pk, ...columns) {

  // Delegate to base impl of cds.validate() for standard input validation
  if (!_is_constraints(x)) return $super.skip (...arguments)

  // Support subject refs to base entities as arguments
  if (x?.ref) [ x, pk ] = [ x.ref +'.constraints', pk.ID||pk ]

  // Run the constraints check query
  const constraints = typeof x === 'string' ? cds.model.definitions[x] || cds.error `No such constraints view: ${x}` : x
  return SELECT.from (constraints, pk, columns.length && columns)

  // Collect and throw errors, if any
  .then (rows => (rows.map ? rows : [rows]).map (checks => {
    const failed = {}; for (let c in checks) {
      if (c in constraints.keys) continue
      if (c[0] == '_') continue
      if (checks[c]) failed[c] = checks[c]
    }
    if (Object.keys(failed).length) throw cds.error `Invalid input: ${failed}`
    return checks
  }))
}


// Helpers
const _is_constraints = x => x.ref || x.is_entity || typeof x === 'string'
