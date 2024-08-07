const cds = require ('@sap/cds')

// Add mashup logic
cds.once('served', require('./srv/mashup'))

// Add routes to UIs from imported packages
cds.once('bootstrap',(app)=>{
  try {
    app.serve ('/bookshop') .from ('@capire/bookshop','app/vue')
    app.serve ('/reviews') .from ('@capire/reviews','app/vue')
    app.serve ('/orders') .from('@capire/orders','app/orders')
    app.serve ('/data') .from('@capire/data-viewer','app/viewer')
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') throw new Error('Run "npm ci" to install the required dependencies', { cause: err })
    throw err
  }
})

// Add Swagger UI
require('./srv/swagger-ui')
