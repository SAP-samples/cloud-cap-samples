const cds = require("@sap/cds");
const jwt = require("jsonwebtoken");

const { ACCESS_TOKEN_SECRET } = cds.env;
class MyUser extends cds.User {
  constructor(attr, roles, id) {
    super({ attr, _roles: roles, id });
  }
}

module.exports = (req, res, next) => {
  const { authorization: authHeader } = req.headers;
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) {
    return res.sendStatus(401);
  }

  try {
    const decodedUser = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = new MyUser(
      { ID: decodedUser.ID },
      decodedUser.roles,
      decodedUser.email
    );
  } catch (error) {
  } finally {
    next();
  }
};
