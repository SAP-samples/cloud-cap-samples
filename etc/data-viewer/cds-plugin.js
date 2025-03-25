const cds = require("@sap/cds")
cds.on ('served', ()=> {
  cds.app.serve ('/data') .from ('@capire/data-viewer','app/viewer')
})
