const cds = require("@sap/cds");

module.exports = async function () {
  const db = await cds.connect.to("db"); // connect to database service
  const { Employees, Customers } = db.entities;

  this.before("*", (req) => {
    console.log(
      "[USER]:",
      req.user.id,
      " [LEVEL]: ",
      req.user.attr.level,
      "[ROLE]",
      req.user.is("user") ? "user" : "other"
    );
  });

  this.on("mockLogin", async (req) => {
    const { email, password } = req.data;

    let userFromDb = await db.run(SELECT.one(Employees).where({ email }));
    let role = "employee";
    if (!userFromDb) {
      userFromDb = await db.run(SELECT.one(Customers).where({ email }));
      role = "customer";
    }
    if (!userFromDb || password !== userFromDb.password) {
      req.reject(401);
    }

    return {
      mockedToken: Buffer.from(`${email}:${password}`).toString("base64"),
      level: role === "customer" ? 1 : 2,
      email: userFromDb.email,
      ID: userFromDb.ID,
      roles: [role],
    };
  });
};
