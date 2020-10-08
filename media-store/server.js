const cds = require("@sap/cds");
// handle bootstrapping events...
cds.on("bootstrap", (app) => {
  // dev only
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PUT, POST, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    //intercepts OPTIONS method
    if ("OPTIONS" === req.method) {
      //respond with 200
      res.sendStatus(200);
    } else {
      //move on
      next();
    }
  });
  // add your own middleware before any by cds are added
});
cds.on("served", () => {
  // add more middleware after all CDS servies
});
// delegate to default server.js:
module.exports = cds.server;
