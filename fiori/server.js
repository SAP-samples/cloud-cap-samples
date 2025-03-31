const cds = require('@sap/cds')
cds.on('served', () => {
  // register a simplified handler for tree table
  // no filtering/searching/collapsing/expanding of nodes
  if (cds.db.kind === 'sqlite') {
    const { AdminService } = cds.services
    AdminService.prepend(() => {
      AdminService.on('READ', 'Genres', () => {
        return SELECT.from('AdminService.Genres')
      })
    })
  }
})