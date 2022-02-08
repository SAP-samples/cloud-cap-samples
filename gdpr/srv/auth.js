/*
 * workaround to avoid approuter et al. setup
 */

const jwt = require('jsonwebtoken')
const tenant = process.env.VCAP_SERVICES
  ? JSON.parse(process.env.VCAP_SERVICES).xsuaa[0].credentials.tenantid
  : 'anonymous'

module.exports = (req, res, next) => {
  /*
   * decode JWT coming from Personal Data Manager
   *
   * DO NOT USE FOR PRODUCTION!
   * - no token validation
   * - no xsappname check
   */
  const bearer = req.headers.authorization && req.headers.authorization.split('Bearer ')[1]
  if (bearer) {
    const { client_id: id, zid: tenant, scope: roles } = jwt.decode(bearer)
    req.user = {
      id,
      tenant,
      is: role => roles.some(r => r.endsWith(`.${role}`))
    }
    return next()
  }

  // mock user that has every role EXCEPT PersonalDataManagerUser
  const basic = req.headers.authorization && req.headers.authorization.split('Basic ')[1]
  if (basic) {
    const [id] = Buffer.from(basic, 'base64').toString('utf-8').split(':')
    req.user = {
      id,
      tenant,
      is: role => role !== 'PersonalDataManagerUser'
    }
    return next()
  }

  // no bearer & no basic -> 401
  res.set('WWW-Authenticate', 'Basic realm="Users"').status(401).end()
}
