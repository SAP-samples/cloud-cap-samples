const cds = require ('@sap/cds')

// Add mashup logic
cds.once('served', require('./srv/mashup'))

// Add routes to UIs from imported packages
cds.once('bootstrap',(app)=>{
  app.serve ('/bookshop') .from ('@capire/bookshop','app/vue')
  app.serve ('/reviews') .from ('@capire/reviews','app/vue')
  app.serve ('/orders') .from('@capire/orders','app/orders')
})

// Add Swagger UI
require('./srv/swagger-ui')

// Returning cds.server
module.exports = cds.server
