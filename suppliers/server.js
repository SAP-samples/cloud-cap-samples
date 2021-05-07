const cds = require ('@sap/cds')

console.log("serverjs")

require('./monkey-patch');

cds.once('served', require('./srv/mashup'))

module.exports = cds.server
