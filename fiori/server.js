const cds = require ('@sap/cds')

cds.emit = function (event,...args) {
  switch (event) {
    case 'served': return this.served = Promise.all (this.listeners(event).map (each => each.call(this,...args)))
    case 'listening': return this.served.then (()=> this.__proto__.emit.call (this, event, ...args))
    default: return this.__proto__.emit.call (this, event, ...args)
  }
}

cds.once('bootstrap',(app)=>{
  app.use ('/orders/webapp', _from('@capire/orders/app/orders/webapp/manifest.json'))
  app.use ('/bookshop', _from('@capire/bookshop/app/vue/index.html'))
  app.use ('/reviews', _from('@capire/reviews/app/vue/index.html'))
})

cds.once('served', require('./srv/mashup'))
cds.once('served', require('@capire/suppliers/srv/mashup'))

module.exports = cds.server


// -----------------------------------------------------------------------
// Helper for serving static content from npm-installed packages
const {static} = require('express')
const {dirname} = require('path')
const _from = target => static (dirname (require.resolve(target)))
