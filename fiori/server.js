const cds = require ('@sap/cds')

cds.once('bootstrap',(app)=>{
  app.use ('/orders/webapp', _from('@capire/orders/app/orders/webapp/manifest.json'))
  app.use ('/bookshop', _from('@capire/bookshop/app/vue/index.html'))
  app.use ('/reviews', _from('@capire/reviews/app/vue/index.html'))
})

cds.once('served', require('./srv/mashup'))

module.exports = cds.server


// -----------------------------------------------------------------------
// Helper for serving static content from npm-installed packages
const {static} = require('express')
const {dirname} = require('path')
const _from = target => static (dirname (require.resolve(target)))
