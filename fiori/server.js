const cds = require('@sap/cds/lib')
if (cds.requires.db.kind === 'sqlite') {

  // Add a column to the Genres table, to efficiently determine if a node
  // is a leaf, and use it for DrillState in hierarchy queries.
  cds.on('loaded', m => Object.assign (
    m.definitions['sap.capire.bookshop.Genres'].elements,
    cds.parse (`entity Genres {
      DrillState: String = coalesce(leaf,'collapsed');
      leaf: String;
    }`).definitions.Genres.elements
  ))

  // Fill in `leaf` helper column for initial data entries
  cds.on('served', ()=> cds.run(`
    UPDATE sap_capire_bookshop_Genres as g SET leaf='leaf' WHERE not exists (
      SELECT 1 from sap_capire_bookshop_Genres WHERE parent_ID = g.ID
    )`
  ))

  // Register a simplistic handler for hierarchical queries
  cds.on('serving:AdminService', srv => srv.prepend(() => srv.on('READ', 'Genres', (req,next) => {
    const q = req.query, parent = {ref:['parent','ID']}
    if (q.SELECT.recurse?.where?.[0].ref[0] === 'Distance') q.SELECT.where[0] = parent
    else if (!q.SELECT.search) q.SELECT.where ??= [ parent, 'is null' ]
    // Suppress error message: Feature "recurse" queries not supported.
    delete q.SELECT.__proto__.recurse
    delete q.SELECT.recurse
    return next()
  })))

}
