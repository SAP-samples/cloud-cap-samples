const cds = require ('@sap/cds')

// Add Swagger UI
require('./srv/swagger-ui')

// For didactic reasons in capire
const { ReviewsService, OrdersService } = cds.requires
if (!ReviewsService?.credentials && !OrdersService?.credentials) cds.requires.messaging = false
