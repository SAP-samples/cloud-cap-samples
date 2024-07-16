import mashup from './srv/mashup.js'
import cds from '@sap/cds'

// Add mashup logic
cds.once('served', mashup)

// Add routes to UIs from imported packages
cds.once('bootstrap',(app)=>{
  app.serve ('/bookshop') .from ('@capire/bookshop','app/vue')
  app.serve ('/reviews') .from ('@capire/reviews','app/vue')
  app.serve ('/orders') .from('@capire/orders','app/orders')
  app.serve ('/data') .from('@capire/data-viewer','app/viewer')
})
