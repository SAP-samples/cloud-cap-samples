const cds = require("@sap/cds");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { ACCESS_TOKEN_SECRET } = cds.env;
const ACCESS_TOKEN_EXP_IN = "10m";

module.exports = async function () {
  const db = await cds.connect.to("db");
  const { Employees, Customers } = db.entities;

  const getUserEntity = (isCustomer) => (isCustomer ? Customers : Employees);

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

  this.on("login", async (req) => {
    const { email, password } = req.data;

    let userFromDb = await db.run(SELECT.one(Employees).where({ email }));
    let roles = ["employee"];
    if (!userFromDb) {
      userFromDb = await db.run(SELECT.one(Customers).where({ email }));
      roles = ["customer"];
    }

    const userEqualPassword = await bcrypt.compare(
      password,
      userFromDb.password
    );
    if (!userEqualPassword) {
      req.reject(401);
    }

    const token = jwt.sign(
      { email, ID: userFromDb.ID, roles },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXP_IN,
      }
    );

    return {
      token,
      roles,
      email: userFromDb.email,
      ID: userFromDb.ID,
    };
  });
};
