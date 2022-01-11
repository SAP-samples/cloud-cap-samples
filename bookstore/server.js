const cds = require ('@sap/cds')

// Add mashup logic
cds.once('served', require('./srv/mashup'))

// Add routes to UIs from imported packages
cds.once('bootstrap',(app)=>{
  app.serve ('/bookshop') .from ('@capire/bookshop','app/vue')
  app.serve ('/reviews') .from ('@capire/reviews','app/vue')
  app.serve ('/orders') .from('@capire/orders','app/orders')
  app.serve ('/data') .from('@capire/data-viewer','app/viewer')
})

// Add Swagger UI
require('./srv/swagger-ui')

// Returning cds.server
module.exports = cds.server

// For didactic reasons in capire
const { ReviewsService, OrdersService } = cds.requires
if (!ReviewsService.credentials && !OrdersService.credentials) cds.requires.messaging = false
