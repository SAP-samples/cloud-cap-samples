const cds = require ('@sap/cds')
const app = require('express')()

// initialize mtx
cds.on('bootstrap',async(app) => {
  await cds.mtx.in(app)
})

// Delegate bootstrapping to built-in server.js
module.exports = cds.server
