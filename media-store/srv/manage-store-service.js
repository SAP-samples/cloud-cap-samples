const cds = require("@sap/cds");

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service

  this.before("CREATE", "*", async (req) => {
    let { ID: lastEntityID } = await db.run(
      SELECT.one(req.entity).columns("ID").orderBy({ ID: "desc" })
    );
    req.data = { ...req.data, ID: ++lastEntityID };
  });
};
