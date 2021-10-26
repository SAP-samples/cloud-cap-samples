const cds = require ('@sap/cds')
module.exports = cds.server

cds.once('bootstrap',(app)=>{
  app.use ('/orders/webapp', _from('@capire/orders/app/orders/webapp/manifest.json'))
  app.use ('/bookshop', _from('@capire/bookshop/app/vue/index.html'))
  app.use ('/reviews', _from('@capire/reviews/app/vue/index.html'))
})

cds.once('served', require('./srv/mashup'))

// Swagger UI - see https://cap.cloud.sap/docs/advanced/openapi
try {
  const cds_swagger = require ('cds-swagger-ui-express')
  cds.once ('bootstrap', app => app.use (cds_swagger()) )
} catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND')  throw err
}


// -----------------------------------------------------------------------
// Helper for serving static content from npm-installed packages
const {static} = require('express')
const {dirname} = require('path')
const _from = target => static (dirname (require.resolve(target)))
