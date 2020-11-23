const cds = require("@sap/cds");
const jwt = require("jsonwebtoken");

const { ACCESS_TOKEN_SECRET } = cds.env;

class MyUser extends cds.User {
  constructor(attr, roles, id) {
    super({ attr, _roles: [...roles], id });
  }
}

module.exports = (req, res, next) => {
  const { authorization: authHeader } = req.headers;
  const token = authHeader && authHeader.split(" ")[1];

  try {
    const decodedUser = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = new MyUser(
      { ID: decodedUser.ID },
      [decodedUser.roles, "authenticated-user"],
      decodedUser.email
    );
  } catch (error) {
    req.user = new cds.User();
  } finally {
    next();
  }
};
