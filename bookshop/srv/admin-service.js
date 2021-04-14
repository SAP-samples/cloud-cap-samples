// sqlite: FK constraint checks need to be enabled by application at runtime
// for each db connection
const cds = require('@sap/cds')
module.exports = cds.service.impl (async function(){ 

  const db = await cds.connect.to('db')

  if (db.kind === 'sqlite')
  {
    db.before('BEGIN', function (req) { 
      //console.log('--- PRAGMA foreign_keys = ON ---')
      return this.dbc.run('PRAGMA foreign_keys = ON;')
    })
  }
})
