const cds = require("@sap/cds");
const {
  getDurationInMilliseconds,
  getFormattedDateTime,
} = require("./util/helpers");

// handle bootstrapping events...
cds.on("bootstrap", (app) => {
  if (cds.env.env === "development") {
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
  }
});
cds.on("served", async ({ db, messaging, ...servedServices }) => {
  // add logging current user before any request
  for (let i in servedServices) {
    servedServices[i].prepend((srv) => {
      srv.on("*", async (req, next) => {
        const method = req._.req.method;
        const url = req._.req.url;
        const start = process.hrtime();

        if (req.user) {
          console.log("[USER]:", req.user.id, req.user.attr, req.user._roles);
        }
        const result = await next();

        const status = req._.res.statusCode;
        const currentDateTime = getFormattedDateTime();
        const durationInMilliseconds = getDurationInMilliseconds(start);
        const log = `[${currentDateTime}] ${durationInMilliseconds.toLocaleString()} ms ${method}:${url} status: ${status} `;
        console.log(log);

        return result;
      });
    });
  }
});

module.exports = cds.server;
