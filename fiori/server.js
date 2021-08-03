const cds = require ('@sap/cds')
module.exports = cds.server

cds.once('bootstrap',(app)=>{
  app.serve ('/orders/webapp').from('@capire/orders','app/orders/webapp')
  app.serve ('/bookshop').from('@capire/bookshop','app/vue')
  app.serve ('/reviews').from('@capire/reviews','app/vue')
})

cds.once('served', require('./srv/mashup'))
cds.once('served', require('@capire/suppliers/srv/mashup'))

// Swagger UI - see https://cap.cloud.sap/docs/advanced/openapi
if (process.env.NODE_ENV !== 'production') {
  cds.once ('bootstrap', app => app.use (require ('cds-swagger-ui-express')()) )
}
