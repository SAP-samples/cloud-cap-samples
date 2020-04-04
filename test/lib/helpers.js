/** For static usage w/o launching a server */
module.exports = exports = {
  get chai() { return _chai() },
  get expect(){ return this.chai.expect },
  get assert(){ return this.chai.assert },
}

// harmonizing jest and mocha
if (global.test) { // it's jest
  global.before = global.beforeAll
  global.after = global.afterAll
} else { // it's mocha
  global.beforeAll = global.before
  global.afterAll = global.after
}

// lazy-loading chai
function _chai(){
  const chai = exports.chai = require('chai')
  .use (require('chai-as-promised'))
  .use (require('chai-subset'))
  chai.should()
  return chai
}


/** Launching and testing a cds server */
exports.launch = (project, args=['--in-memory?']) => {

  const cds = require('@sap/cds')

  if (!cds.utils.existsSync(project)) try {
    project = require('path').dirname (require.resolve(project+'/package.json'))
  } catch(e) {
    throw cds.error (`Cannot resolve project folder for '${project}'`)
  }

  const axios = require('axios').default
  let baseURL //... be filled in below

  // launch cds server...
  before (done => {

    const console = global.console, logs=[]
    global.console = { __proto__: global.console, logs,
      time: ()=>{}, timeEnd: (...args)=> logs.push(args),
      debug: (...args)=> logs.push(args),
      log: (...args)=> logs.push(args),
      warn: (...args)=> logs.push(args),
      error: (...args)=> logs.push(args),
      dump(){ for (let each of logs) console.log (...each) },
    }

    process.env.PORT = '0'
    const p = cds.exec ('run', project, ...args) // TODO w/ @sap/cds@3.33.3: , '--port', '0')
    if (p && 'catch' in p) p.catch (done)

    cds.once('listening', ({ server, url }) => {
      after (done => {
        if (global.console !== console) global.console = console
        server.close (done)
      })
      baseURL = url
      done()
    })
  })

  return {

    GET: (path) => axios.get (baseURL+path) .catch(_error),
    PUT: (path,data) => axios.put (baseURL+path,data) .catch(_error),
    POST: (path,data) => axios.post (baseURL+path,data) .catch(_error),
    PATCH: (path,data) => axios.patch (baseURL+path,data) .catch(_error),
    DELETE: (path) => axios.delete (baseURL+path) .catch(_error),

    get: (path) => axios.get (baseURL+path) .catch(_error),
    put: (path,data) => axios.put (baseURL+path,data) .catch(_error),
    post: (path,data) => axios.post (baseURL+path,data) .catch(_error),
    patch: (path,data) => axios.patch (baseURL+path,data) .catch(_error),
    delete: (path) => axios.delete (baseURL+path) .catch(_error),

    get chai(){ return _chai() },
    get expect(){ return this.chai.expect },
    get assert(){ return this.chai.assert },
  }

  function _error (e) {
    if (!e.response)  throw e
    if (!e.response.data)  throw e
    if (!e.response.data.error)  throw e
    const { code, message } = e.response.data.error
    throw new Error (`${code} - ${message}`)
  }
}
