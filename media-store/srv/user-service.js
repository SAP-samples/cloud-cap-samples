const cds = require("@sap/cds");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { ACCESS_TOKEN_SECRET } = cds.env;
const ACCESS_TOKEN_EXP_IN = "10m";

module.exports = async function () {
  const db = await cds.connect.to("db");
  const { Employees, Customers } = db.entities;

  this.before("UPDATE", "*", async (req) => {
    req.query = req.query.where({ ID: req.user.attr.ID });
  });

  this.before("READ", "*", async (req) => {
    req.query = req.query.where({ ID: req.user.attr.ID });
  });

  this.on("login", async (req) => {
    const { email, password } = req.data;

    let userFromDb = await db.run(SELECT.one(Employees).where({ email }));
    let roles = ["employee"];
    if (!userFromDb) {
      userFromDb = await db.run(SELECT.one(Customers).where({ email }));
      roles = ["customer"];
    }
    const userEqualPassword = await new Promise((resolve, reject) =>
      bcrypt.compare(password, userFromDb.password, (err, res) => {
        if (err || res === false) {
          reject(err);
        } else {
          resolve(res);
        }
      })
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
