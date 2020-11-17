const express = require ('express')
const cds = require ('@sap/cds')

cds.once('bootstrap',(app)=>{
  const {dirname} = require ('path')
  // serving the orders app imported from @capire/orders
  const orders_app = dirname (require.resolve('@capire/orders/app/orders/webapp/manifest.json'))
  app.use ('/orders/webapp', express.static(orders_app))
  // serving the vue.js app imported from @capire/bookshop
  const vue_app = dirname (require.resolve('@capire/bookshop/app/vue/index.html'))
  app.use ('/vue', express.static(vue_app))
})

cds.once('served', require('./srv/mashup'))

module.exports = cds.server
