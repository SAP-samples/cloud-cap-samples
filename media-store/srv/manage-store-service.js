const cds = require("@sap/cds");

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service

  this.on("CREATE", "*", async (req) => {
    const selectLastQuery = SELECT.one(req.entity)
    .orderBy({ ID: "desc" });

    const transaction = await db.tx(req);

    let { ID: lastEntityID } = await transaction.run(selectLastQuery);

    const columns = ["ID", ...Object.keys(req.data)];
    const values = [++lastEntityID, ...Object.values(req.data)];
    const insertQuery = INSERT.into(req.entity).columns(columns).values(values);

    await transaction.run(insertQuery);
    const result = await transaction.run(selectLastQuery);

    await transaction.commit();

    return result;
  });
};
