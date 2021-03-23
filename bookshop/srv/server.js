const cds = require ('@sap/cds')

cds.on('listening', async ()=>{ try { //> just to see the output at the end; will later on be in db service impl
  console.log ('\nFilling database with initial data...')
  const m = cds.model.minified() //> we likely should do that by default
  const tx = cds.tx()
  tx.run ([ //> this will be replaced by
    DELETE.from ('sap.capire.bookshop.Authors'),
    DELETE.from ('sap.capire.bookshop.Books'),
    DELETE.from ('sap.capire.bookshop.Books.texts'),
    DELETE.from ('sap.capire.bookshop.Genres'),
    DELETE.from ('sap.common.Currencies'),
    DELETE.from ('sap.common.Currencies.texts'),
  ])
  await cds.deploy(m).to(tx,{ddl:false})
  await tx.commit()
} catch(e) { console.error(e) }})

module.exports = cds.server
