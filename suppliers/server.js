const cds = require ('@sap/cds')
cds.once('served', require('./srv/mashup'))
module.exports = cds.server
