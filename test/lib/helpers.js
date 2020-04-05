/** For static usage w/o launching a server */
module.exports = exports = {
  get chai() { return _chai() },
  get expect(){ return this.chai.expect },
  get assert(){ return this.chai.assert },
}

// harmonizing jest and mocha
const is_mocha = !global.test
const is_jest = !!global.test
if (is_jest) { // it's jest
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
exports.launch = (project, ...args) => {

  // Setting up test server
  const console = global.console, logs=[]
  const axios = require('axios').default
  const test = {

    GET: (path) => axios.get (test.url+path) .catch(_error),
    PUT: (path,data) => axios.put (test.url+path,data) .catch(_error),
    POST: (path,data) => axios.post (test.url+path,data) .catch(_error),
    PATCH: (path,data) => axios.patch (test.url+path,data) .catch(_error),
    DELETE: (path) => axios.delete (test.url+path) .catch(_error),

    get: (path) => axios.get (test.url+path) .catch(_error),
    put: (path,data) => axios.put (test.url+path,data) .catch(_error),
    post: (path,data) => axios.post (test.url+path,data) .catch(_error),
    patch: (path,data) => axios.patch (test.url+path,data) .catch(_error),
    delete: (path) => axios.delete (test.url+path) .catch(_error),

    get chai(){ return _chai() },
    get expect(){ return this.chai.expect },
    get assert(){ return this.chai.assert },
  }

  // launch cds server...
  before (done => {

    const cds = require('@sap/cds')

    let cmd = 'run'
    if (project.startsWith('cds ')) [ cmd, project ] = [ project.slice(4), args.shift() ]
    if (!args.length) args = ['--in-memory?']

    // Supporting .launch (<package name>)
    if (cmd === 'run' && !cds.utils.existsSync(project)) try {
      project = require('path').dirname (require.resolve(project+'/package.json'))
    } catch(e) {
      throw cds.error (`Cannot resolve project folder for '${project}'`)
    }

    if (!process.env.CDS_TEST_VERBOSE) global.console = { __proto__: global.console, logs,
      time: ()=>{}, timeEnd: (...args)=> logs.push(args),
      debug: (...args)=> logs.push(args),
      log: (...args)=> logs.push(args),
      warn: (...args)=> logs.push(args),
      error: (...args)=> logs.push(args),
      dump(){ for (let each of logs) console.log (...each) },
    }

    // return done (new Error(11))
    process.env.PORT = '0'
    const p = cds.exec (cmd, project, ...args) // TODO w/ @sap/cds@3.33.3: , '--port', '0')
    if (p && 'catch' in p) p.catch (e => {
      if (is_mocha) console.error(e)
      done(e)
  })
    // return done(new Error('dfghjkl'))

    cds.once('listening', ({ server, url }) => {
      Object.assign (test,{server,url})
      done()
    })
  })

  // shutdown cds server...
  after (done => {
    if (global.console !== console) global.console = console
    test.server ? test.server.close (done) : done()
  })

  function _error (e) {
    if (!e.response)  throw e
    if (!e.response.data)  throw e
    if (!e.response.data.error)  throw e
    const { code, message } = e.response.data.error
    throw new Error (`${code} - ${message}`)
  }

  return test
}
