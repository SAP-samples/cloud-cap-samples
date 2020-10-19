const cds = require("@sap/cds");

const USER_LEVELS = { customer: 1, employee: 2 };

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

  this.on("getUser", async (req) => {
    return await db.run(
      SELECT.one(Customers)
        .columns(
          "lastName",
          "firstName",
          "city",
          "state",
          "address",
          "country",
          "postalCode",
          "phone",
          "fax",
          "email"
        )
        .where({ email: req.user.id })
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
      level: USER_LEVELS[role],
      email: userFromDb.email,
      ID: userFromDb.ID,
      roles: [role],
    };
  });
};
