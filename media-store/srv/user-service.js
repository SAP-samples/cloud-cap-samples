const cds = require("@sap/cds");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = cds.env;
const ACCESS_TOKEN_EXP_IN = "10m";
const REFRESH_TOKEN_EXPIRES_IN = "20m";

const comparePasswords = async (password, hashedPassword) => {
  return new Promise((resolve, reject) =>
    bcrypt.compare(password, hashedPassword, (err, res) => {
      if (err || res === false) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  );
};

const createTokens = (email, ID, roles) => {
  const accessToken = jwt.sign({ email, ID, roles }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXP_IN,
  });
  const refreshToken = jwt.sign({ email, ID, roles }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
  return [accessToken, refreshToken];
};

module.exports = async function () {
  const db = await cds.connect.to("db");
  const { Employees, Customers } = db.entities;

  async function getUser(email) {
    let userFromDb = await db.run(SELECT.one(Employees).where({ email }));
    let roles = ["employee"];
    if (!userFromDb) {
      userFromDb = await db.run(SELECT.one(Customers).where({ email }));
      roles = ["customer"];
    }
    return Object.assign({}, userFromDb, { roles });
  }

  this.before("UPDATE", "*", async (req) => {
    req.query = req.query.where({ ID: req.user.attr.ID });
  });

  this.before("READ", "*", async (req) => {
    req.query = req.query.where({ ID: req.user.attr.ID });
  });

  this.on("login", async (req) => {
    const { email, password } = req.data;

    const userFromDb = await getUser(email);
    if (!userFromDb) {
      req.reject(401);
    }

    try {
      await comparePasswords(password, userFromDb.password);
    } catch (error) {
      req.reject(401);
    }

    const [accessToken, refreshToken] = createTokens(
      userFromDb.email,
      userFromDb.ID,
      userFromDb.roles
    );

    return {
      accessToken,
      refreshToken,
      ID: userFromDb.ID,
      email: userFromDb.email,
      roles: userFromDb.roles,
    };
  });

  this.on("refreshTokens", async (req) => {
    let decodedUser;
    try {
      const { refreshToken } = req.data;
      decodedUser = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    } catch (error) {
      req.reject(401);
    }

    const userFromDb = await getUser(decodedUser.email);
    if (!userFromDb) {
      req.reject(401);
    }

    const [accessToken, refreshToken] = createTokens(
      userFromDb.email,
      userFromDb.ID,
      userFromDb.roles
    );

    return {
      accessToken,
      refreshToken,
      ID: userFromDb.ID,
      email: userFromDb.email,
      roles: userFromDb.roles,
    };
  });
};
