import cds from '@sap/cds'

export default class UserService extends cds.Service { init(){
  this.on('READ', 'me', ({ tenant, user, locale }) => ({ id: user.id, locale, tenant }))
  this.on('login', (req) => {
    if (req.user._is_anonymous)
      req._.res.set('WWW-Authenticate','Basic realm="Users"').sendStatus(401)
    else return this.read('me')
  })
}}
