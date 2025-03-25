const cds = require("@sap/cds")
cds.on ('served', ()=> { // doing that on 'served' to go after the app's own services
  cds.app.serve ('/data') .from('@capire/data-viewer','app/viewer')
})
