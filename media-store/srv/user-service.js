const cds = require("@sap/cds");

const USER_LEVELS = { customer: 1, employee: 2 };

module.exports = async function () {
  const db = await cds.connect.to("db");
  const { Employees, Customers } = db.entities;

  const getUserEntity = (isCustomer) => (isCustomer ? Customers : Employees);

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

  this.on("updatePerson", async (req) => {
    await UPDATE(
      getUserEntity(req.user && req.user._roles && req.user.is("customer"))
    )
      .set(req.data.person)
      .where({ ID: req.user.attr.ID });
  });

  this.on("getPerson", async (req) => {
    return await db.run(
      SELECT.one(
        getUserEntity(req.user && req.user._roles && req.user.is("customer"))
      )
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
