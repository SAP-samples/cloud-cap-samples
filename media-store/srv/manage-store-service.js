const cds = require("@sap/cds");

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service

  this.on("CREATE", "*", async (req) => {
    const transaction = await db.tx(req);
    let { ID: lastEntityID } = await transaction.run(
      SELECT.one(req.entity).columns("ID").orderBy({ ID: "desc" })
    );
    const columns = ["ID", ...Object.keys(req.data)];
    const values = [++lastEntityID, ...Object.values(req.data)];

    await transaction.run(req.query.columns(columns).values(values));
    await transaction.commit();
  });
};
