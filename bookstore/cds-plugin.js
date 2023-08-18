const cds = require ('@sap/cds')

// Add routes to UIs from imported packages
cds.once('bootstrap',(app)=>{
  app.serve ('/admin-authors') .from ('@capire/fiori','app/admin-authors')
  app.serve ('/admin-books') .from ('@capire/fiori','app/admin-books')
  app.serve ('/browse-books') .from ('@capire/fiori','app/browse')
})

// Add mashup logic
cds.once('served', require('./srv/mashup'))

// Add Swagger UI
require('./srv/swagger-ui')

// For didactic reasons in capire
const { ReviewsService, OrdersService } = cds.requires
if (!ReviewsService?.credentials && !OrdersService?.credentials) cds.requires.messaging = false