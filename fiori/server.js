const cds = require ('@sap/cds')

cds.emit = function (event,...args) {
  switch (event) {
    case 'served': return this.served = Promise.all (this.listeners(event).map (each => each.call(this,...args)))
    case 'listening': return this.served.then (()=> this.__proto__.emit.call (this, event, ...args))
    default: return this.__proto__.emit.call (this, event, ...args)
  }
}

cds.once('bootstrap',(app)=>{
  app.serve ('/orders/webapp').from('@capire/orders','app/orders/webapp')
  app.serve ('/bookshop').from('@capire/bookshop','app/vue')
  app.serve ('/reviews').from('@capire/reviews','app/vue')
})

cds.once('served', require('./srv/mashup'))
cds.once('served', require('@capire/suppliers/srv/mashup'))

module.exports = cds.server
