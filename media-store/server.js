const cds = require("@sap/cds");

// handle bootstrapping events...
cds.on("bootstrap", (app) => {
  // dev only
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, PUT, PATCH, POST, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, Accept-Language"
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
cds.on("served", async ({ db, messaging, ...servedServices }) => {
  // add logging current user before any request
  for (let i in servedServices) {
    servedServices[i].prepend((srv) =>
      srv.before("*", (req) => console.log("[USER]:", req.user))
    );
  }
});

module.exports = cds.server;
