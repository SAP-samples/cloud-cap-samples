const cds = require("@sap/cds")

// install OData v2 adapter
const proxy = require('@sap/cds-odata-v2-adapter-proxy')
const proxyOpts = global.it ? { target:'auto' } : {} // for tests, set 'auto' to detect port dynamically
cds.on('bootstrap', app => app.use(proxy(proxyOpts)))

module.exports = require('@capire/bookstore/server.js')