// install OData v2 adapter
const cds = require("@sap/cds")
const proxy = require('@cap-js-community/odata-v2-adapter')
const opts = global.it ? { target:'auto' } : {}   // for tests, set 'auto' to detect port dynamically
cds.once('bootstrap', app => {
    app.use(proxy(opts))  // install proxy
    // cds.log('cov2ap','silent') // suppress anoying log outpout, e.g. for `npm run mocha -- --reporter nyan`
    app.serve ('/fiori-apps') .from ('@capire/fiori','app/fiori-apps.html')
})
