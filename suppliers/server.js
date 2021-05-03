const cds = require ('@sap/cds')

require('./monkey-patch');

cds.once('served', require('./srv/mashup'))
module.exports = cds.server
