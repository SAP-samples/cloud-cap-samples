const express = require ('express')
const cds = require ('@sap/cds')

const _imported = (path,file) => express.static(
  require.resolve(`${path}/${file}`).slice(0,-1-file.length)
)

cds.once('bootstrap',(app)=>{
  // serving the orders app imported from @capire/orders
  app.use ('/orders/webapp', _imported('@capire/orders/app/orders/webapp','manifest.json'))
  // serving the vue.js app imported from @capire/bookshop
  app.use ('/vue', _imported('@capire/bookshop/app/vue','index.html'))
})

cds.once('served', require('./srv/mashup'))

module.exports = cds.server
