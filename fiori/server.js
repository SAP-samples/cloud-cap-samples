const cds = require('@sap/cds')
cds.on('served', () => {
  // register a simplified handler for tree table
  // no filtering/searching/collapsing/expanding of nodes
  if (cds.db.kind === 'sqlite') {
    const { AdminService } = cds.services
    AdminService.prepend(() => {
      AdminService.on('READ', 'Genres', (req,next) => {
        const { SELECT } = req.query
        // Suppress error message: Feature "recurse" queries not supported.
        delete SELECT.__proto__.recurse
        delete SELECT.recurse
        return next()
      })
    })
  }
})
