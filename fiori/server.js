const cds = require('@sap/cds/lib')
if (cds.requires.db?.kind === 'sqlite') {
  cds.on ('serving:AdminService', srv => srv.prepend(() => {
    const {Genres} = srv.entities
  // Register a simplistic handler for hierarchical queries
    srv.on('READ', Genres, (req,next) => {
      const q = req.query
      // Expand query on a single row
      if (q.SELECT.recurse?.where?.[0].ref[0] === 'Distance') {
        q.SELECT.where[0] = 'parent_ID'
      // Initial query
      } else if (!q.SELECT.search && !is_count(q)) {
        q.SELECT.where ??= [ 'parent_ID is null' ]
      }
      // Use scalar subselect for DrillState
      q.SELECT.from.as = 'g'
      q.SELECT.columns = q.SELECT.columns.map (c => {
        if (c.ref == 'DrillState') return { xpr:[`
          CASE WHEN ( SELECT count(1) from ${Genres} where parent_ID = g.ID ) > 0
          THEN 'collapsed' ELSE 'leaf' END`
        ], as: 'DrillState' }
        else return c
      })
      // Suppress error message: Feature "recurse" queries not supported.
      delete q.SELECT.__proto__.recurse
      delete q.SELECT.recurse
      return next()
    })
  }))
}

const is_count = q => q.SELECT.columns?.length === 1 && q.SELECT.columns[0].func === 'count'
