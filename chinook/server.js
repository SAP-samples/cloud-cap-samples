const cds = require("@sap/cds")

// Allow X-origin requests for React app during evelopment
if (cds.env.env === "development") {
  cds.on("bootstrap", (app) => app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PUT, PATCH, POST, DELETE, OPTIONS"
    )
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Accept-Language"
    )
    //intercept OPTIONS method
    if (req.method === 'OPTIONS') res.sendStatus(200)
    else next()
  }))
}

module.exports = cds.server
