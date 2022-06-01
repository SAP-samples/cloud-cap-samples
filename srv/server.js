const cds = require('@sap/cds')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const LOG = cds.log('server')
const OpenIDConnectStrategy = require('passport-openidconnect')
const LdapStrategy = require('passport-ldapauth')
const passport = require('passport')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)
const { Settings } = require('luxon')
const { RateLimiterMemory } = require('rate-limiter-flexible')
const { BasicStrategy } = require('passport-http')

// Configure the time zone
Settings.defaultZone = 'UTC'

// const csrf = require('csrf')
// const express = require('express')

cds.on('bootstrap', (app) => {
  registerSession(app)
  app.use(cookieParser())
  registerHelmet(app)
  registerSwaggerUi(app)
  registerConvenienceEndpoints(app)
  registerAuthentication(app)
})



const maxWrongAttemptsByIPperDay = cds.env.maxloginattemptsperday
  ? cds.env.maxloginattemptsperday
  : 100

const limiterSlowBruteByIP = new RateLimiterMemory({
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24 // Block for 1 hour, if 100 wrong attempts per hour
})

const registerHelmet = function (app) {
  const directives = {
    'script-src': [
      "'unsafe-eval'",
      "'unsafe-inline'",
      "'self'",
      'https://ui5.sap.com',
      'https://unpkg.com'
    ],
    'default-src': [
      "'self'",
      'https://ui5.sap.com',
      'https://unpkg.com'
    ]
  }

  if (cds.env.session.secret === 'secret') {
    directives['script-src'].push('http://127.0.0.1:35729')
    directives['script-src'].push('http://localhost:35729')
    directives['default-src'].push('ws://localhost:35729')
    directives['default-src'].push('ws://127.0.0.1:35729')
  }

  if (cds.env.log?.service) {
    directives['script-src'].push('https://cdn.jsdelivr.net')
    directives['default-src'].push('https://cdn.jsdelivr.net')
  }

  // app.use(
  //   helmet({
  //     contentSecurityPolicy: {
  //       useDefaults: true,
  //       directives
  //     },
  //     crossOriginEmbedderPolicy: false
  //   })
  // )
}

const registerSession = function (app) {
  const sess = {
    secret: cds.env.session.secret,
    resave: false,
    rolling: true,
    store: new MemoryStore({
      checkPeriod: 24 * 60 * 60 * 1000 // prune expired entries every 24h
    }),
    saveUninitialized: false,
    cookie: {
      sameSite: cds.env.session.secret !== 'secret',
      domain: cds.env.domain
        ? cds.env.domain
        : new URL(cds.env.oidc.callbackurl).host,
      path: '/',
      secure: cds.env.session.secret !== 'secret',
      maxAge: 60 * 60 * 1000 // 1 hour
    },
    name: 'db2-cap-samples-session'
  }

  app.use(session(sess)) // njsscan-ignore: cookie_session_no_secure, cookie_session_no_samesite
}

const registerSwaggerUi = function (app) {
  if (!cds.env?.env?.includes('production')) {
    const swagger = require('cds-swagger-ui-express')
    app.use(swagger())
  }
}

const registerConvenienceEndpoints = function (app) {
  app.get('/healthcheck', (_, res) => {
    res.status(200).send('OK')
  })
}

const checkLoginLimit = async (req, res) => {
  try {
    await limiterSlowBruteByIP.consume(req.ip)
  } catch (rlRejected) {
    if (rlRejected instanceof Error) {
      throw rlRejected
    } else {
      LOG.warn('Too many login attempts from same ip address')
      res.set(
        'Retry-After',
        String(Math.round(rlRejected.msBeforeNext / 1000)) || 1
      )
      res.status(429).send('Too Many Requests')
      return false
    }
  }
  return true
}

const checkIpRateLimit = async function (req, res) {
  if (!(await checkLoginLimit(req, res))) return false
  const resSlowByIP = limiterSlowBruteByIP.get(req.ip)
  let retrySecs = 0

  if (
    resSlowByIP !== null &&
    resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay
  ) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1
  }

  if (retrySecs > 0) {
    res.set('Retry-After', String(retrySecs))
    res.status(429).send('Too Many Requests')
    return false
  } else {
    return true
  }
}

const persistUserInDb = async function (user) {
  const exists = await SELECT.one
    .from('Users')
    .where({ ID: user.id })
    .columns(['ID'])

  let type = 'user'
  if (user.roles.includes('authority')) {
    type = 'authority'
  } else if (user.roles.includes('approver')) {
    type = 'approver'
  }

  const dbUser = {
    ID: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    title: user.title ? user.title : '',
    email: user.email,
    type
  }

  if (exists) {
    return await UPDATE('Users')
      .set(dbUser)
      .where({ ID: user.id })
  }
  return INSERT.into('Users').entries(dbUser)
}

const loginOidc = async function (req, res, user) {
  LOG.info('OIDC Login success', user)
  // If you want to save the user in a DB
  // await persistUserInDb(user)

  limiterSlowBruteByIP.delete(req.ip)

  const host = cds.env.domain
    ? cds.env.domain
    : new URL(cds.env.oidc.callbackurl).host

  if (cds.env.oidc.redirecttarget) { return res.redirect(cds.env.oidc.redirecttarget) }

  return res.redirect(
    `https://${host}${
      cds.env.proxylocation ? cds.env.proxylocation : ''
    }/travel_processor/`
  )
}

const registerOidc = function (app) {
  passport.use(
    new OpenIDConnectStrategy(
      {
        issuer: cds.env.oidc.issuer,
        authorizationURL: cds.env.oidc.authorizationurl,
        tokenURL: cds.env.oidc.tokenurl,
        userInfoURL: cds.env.oidc.userinfourl,
        clientID: cds.env.oidc.clientid,
        clientSecret: cds.env.oidc.clientsecret,
        callbackURL: cds.env.oidc.callbackurl
      },
      function verify (
        _issuer,
        uiProfile,
        profile,
        _context,
        idToken,
        _accessToken,
        _refreshToken,
        _params,
        cb
      ) {
        profile.attr = {}
        profile.idToken = idToken
        profile.roles = uiProfile?._json?.roles
        profile.firstName = profile.name?.givenName
        profile.lastName = profile.name?.familyName
        // profile.email = profile.emails[0].value
        profile.title = uiProfile?._json?.title
        profile.attr.bpNumber = profile.bpNumber = uiProfile?._json?.bpNumber
        profile.attr.type = profile.type = uiProfile?._json?.roles

        return cb(null, profile)
      }
    )
  )

  app.get('/oidclogin', passport.authenticate('openidconnect'))

  app.get('/callback', async (req, res, next) => {
    if (!(await checkIpRateLimit(req, res))) return
    return await passport.authenticate(
      'openidconnect',
      async (err, user, info) => {
        LOG.info('Authentication via OIDC')
        if (err) {
          LOG.error('OIDC Login failed', err)
          return next(err)
        }

        if (!user) {
          LOG.error('OIDC Autentication failed', info)
          return res.status(401).json(info)
        }

        req.login(user, async (loginErr) => {
          if (loginErr) {
            LOG.error('OIDC Login error', loginErr)
            return next(loginErr)
          }

          return await loginOidc(req, res, user)
        })
      }
    )(req, res, next)
  })
}

const registerBasicAuth = function (app) {
  LOG.info('Register basic authentication handler')
  passport.use(
    new BasicStrategy(function (username, password, next) {
      const user = cds.env.users.find((user) => user.username === username)

      if (!user) {
        LOG.error('Basic Auth Login User not found with user', username)
        return next(null, false)
      }
      if (!(user.password === password)) {
        LOG.error('Basic Auth Login Password wrong with user', username)
        return next(null, false)
      }
      LOG.info('Basic Auth Login successful with user', username)
      return next(null, user)
    })
  )

  app.use(
    '/sap-api/',
    passport.authenticate('basic', { session: false }),
    async function (_req, _res, next) {
      next()
    }
  )
}

const registerLdap = function (app) {
  passport.use(
    new LdapStrategy({
      server: {
        url: cds.env.ldap.url,
        bindDN: cds.env.ldap.binddn,
        bindCredentials: cds.env.ldap.bindcredentials,
        searchBase: cds.env.ldap.searchbase,
        searchFilter: cds.env.ldap.searchfilter,
        searchAttributes: cds.env.ldap.searchattributes
      }
    })
  )

  app.post('/ldaplogin', bodyParser.json(), async (req, res, next) => {
    if (!(await checkIpRateLimit(req, res))) return
    passport.authenticate('ldapauth', function (err, user, info) {
      LOG.info('Authentication via LDAP')

      if (err) {
        LOG.error('LDAP Login failed: ' + err)
        return next(err) // will generate a 500 error
      }

      if (!user) {
        LOG.error('LDAP Authentication failed: ' + JSON.stringify(info))
        return res
          .status(401)
          .json({ success: false, message: 'authentication failed' })
      } else {
        LOG.info('LDAP Login success', user)
        limiterSlowBruteByIP.delete(req.ip)
        return res.status(200).json({ success: true })
      }
    })(req, res, next)
  })
}

const registerAuthentication = function (app) {
  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    done(null, user)
  })

  if (cds.env.oidc) {
    registerOidc(app)
  }

  if (cds.env.ldap) {
    registerLdap(app)
  }

  if (
    cds.env.requires.auth.kind !== 'basic-auth' &&
    cds.env.requires.auth.kind !== 'mock-auth' &&
    cds.env.requires.auth.kind !== 'mocked-auth'
  ) {
    registerBasicAuth(app)
  }

  app.get('/logout', (req, res) => {
    const logoutUrl = new URL(cds.env.oidc ? cds.env.oidc.logouturl : '/')
    if (req.session?.passport?.user?.idToken) {
      logoutUrl.searchParams.append(
        'id_token_hint',
        req.session.passport.user.idToken
      )
      logoutUrl.searchParams.append(
        'post_logout_redirect_uri',
        cds.env.oidc.loginurl
      )
    }
    req.session.destroy()
    res.redirect(logoutUrl)
  })

  app.get('/login', (req, res) => {
    req.session.loginStrategy = 'ldap'

    if (cds.env.oidc) {
      req.session.loginStrategy = 'oidc'
    }

    return res.redirect(`${req.session.loginStrategy}login`) // njsscan-ignore: express_open_redirect
  })

  app.get('/loginerror', (req, _res) => {
    LOG.error('Login error', req.session.messages)
  })
}


// handle and override options
module.exports = (o) => {
  // if in production do not deliver default index
  if (
    cds.env?.env?.includes('production') ||
    cds.env?.env?.includes('hybrid')
  ) {
    o.index = (_req, res) => {
      if (cds.env.oidc) {
        return res.redirect('travel_processor/webapp/')
      }
      return res.redirect('config/')
    }
    o.static = './app'
  }
  return cds.server(o) // > delegate to default server.js
}
