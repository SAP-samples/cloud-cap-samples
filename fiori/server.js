const cds = require ('@sap/cds')

cds.once('bootstrap',(app)=>{
  app.serve ('/orders/webapp').from('@capire/orders','app/orders/webapp')
  app.serve ('/bookshop').from('@capire/bookshop','app/vue')
  app.serve ('/reviews').from('@capire/reviews','app/vue')
})

cds.once('served', require('./srv/mashup'))
cds.once('served', require('@capire/suppliers/srv/mashup'))

module.exports = cds.server
