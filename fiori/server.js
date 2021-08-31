const cds = require ('@sap/cds')
module.exports = cds.server

cds.once('bootstrap',(app)=>{
  app.use ('/orders/webapp', _from('@capire/orders/app/orders/webapp/manifest.json'))
  app.use ('/bookshop', _from('@capire/bookshop/app/vue/index.html'))
  app.use ('/reviews', _from('@capire/reviews/app/vue/index.html'))
})

cds.once('served', require('./srv/mashup'))

// Swagger UI - see https://cap.cloud.sap/docs/advanced/openapi
if (process.env.NODE_ENV !== 'production') {
  const cds_swagger = require ('cds-swagger-ui-express')
  cds.once ('bootstrap', app => app.use (cds_swagger()) )
}


// -----------------------------------------------------------------------
// Helper for serving static content from npm-installed packages
const {static} = require('express')
const {dirname} = require('path')
const _from = target => static (dirname (require.resolve(target)))
