const cds = require('@sap/cds')

module.exports = (req, _res, next) => {
  class OidcUser extends cds.User {
    is (role) {
      return role in this._roles
    }
  }

  class Anonymous extends cds.User {
    is (role) {
      return role === 'any'
    }

    get _roles () {
      return {}
    }
  }
  Anonymous.prototype._is_anonymous = true
  Anonymous.prototype.id = 'anonymous'

  const user = req.session?.passport?.user ? req.session?.passport?.user : req.user

  if (user) {
    const roles = {
      any: true,
      'identified-user': true,
      'authenticated-user': true
    }
    if (user.roles) {
      user.roles.forEach((role) => {
        roles[role] = true
      })
    }

    req.user = new OidcUser({
      id: user.id,
      _roles: roles,
      attr: {
        email: user.email,
        firstname: user.name?.familyName,
        lastname: user.name?.givenName,
        type: user.type
      }
    })
  } else {
    req.user = new Anonymous()
  }

  next()
}
