const spawn = require('cross-spawn')
const HttpProxy = require('http-proxy')

function spawnServer (cmd, args, cwd, fnIsReady) {
  return new Promise((resolve, reject) => {
    const proc = spawn(cmd, args, {
      cwd,
      env: Object.assign({ PORT: 0 }, process.env),
      stdio: ['ignore', 'pipe', 'inherit']
    })

    const checkServerReady = (data) => {
      const targetUrl = fnIsReady(data.toString())
      if (targetUrl) {
        proc.stdout.removeListener('data', checkServerReady)
        resolve(targetUrl)
      }
    }

    proc.on('close', reject)
    proc.stdout.on('data', checkServerReady)

    // clean up sub process
    process.on('exit', () => { if (proc) proc.kill() })
  })
}

function createKarmaMiddleware (serverUrl, auth) {
  const proxyOptions = {
    target: serverUrl,
    auth: auth ? `${auth.user}:${auth.password}` : undefined
  }

  const middleware = (logFactory) => {
    const log = logFactory.create('cap-server')

    const proxy = new HttpProxy(proxyOptions)
    proxy.on('error', (data) => log.error(data.toString()))

    return (req, res, next) => {
      if (req.url.startsWith('/processor')) {
        return proxy.web(req, res)
      }
      return next()
    }
  }

  middleware.$inject = ['logger']
  return { 'middleware:cap-proxy': ['factory', middleware] }
}

async function java () {
  const isReady = (data) => {
    const started = data.match(/started on port\(s\): (?<port>\d+)/)
    if (started) return new URL(`http://localhost:${started.groups.port}`)
  }
  const serverUrl = await spawnServer(
    'mvn',
    ['spring-boot:run', '-B', '-Dserver.port=0'],
    '../../srv',
    isReady
  )

  return createKarmaMiddleware(serverUrl, { user: 'admin', password: 'admin' })
}

async function node () {
  const isReady = (data) => {
    const started = data.match(/server listening on {.*url:.*'(?<url>.+)'.*}/)
    if (started) return new URL(started.groups.url)
  }
  const serverUrl = await spawnServer('npm', ['start'], '../..', isReady)

  return createKarmaMiddleware(serverUrl, { user: 'admin', password: 'admin' })
}

module.exports = { java, node }
