module.exports = require('@capire/bookstore/server.js')
const cds = require ('@sap/cds')
cds.on('bootstrap', (app) => app.use ((req,res,next) => {
  req.features = req.headers.features?.split(',') || ['isbn']
  next()
}))
