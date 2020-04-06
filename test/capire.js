/** For static usage w/o launching a server */
const { resolve, dirname } = require('path')

class CDSTestKit {
  for (...paths) {
    const tk = new CDSTestKit
    tk.root = resolve (...paths)
    return tk
  }
  get chai() {
    const chai = require('chai')
    chai.use (require('chai-as-promised'))
    chai.use (require('chai-subset'))
    chai.should()
    Object.defineProperty (this, 'chai', {value:chai})
    return chai
  }
  get expect(){ return this.chai.expect }
  get assert(){ return this.chai.assert }
}

const lazy = (new CDSTestKit) .for (__dirname,'../..')
module.exports = exports = lazy

// harmonizing jest and mocha
const is_mocha = !global.test
const is_jest = !!global.test
if (is_jest) { // it's jest
  global.before = (msg,fn) => global.beforeAll(fn||msg)
  global.after = (msg,fn) => global.afterAll(fn||msg)
} else { // it's mocha
  global.beforeAll = global.before
  global.afterAll = global.after
  global.test = global.it
}


/** Launching and testing a cds server */
exports.launch = (project, ...args) => {

  // Setting up test server
  const console = global.console, logs=[]
  const axios = require('axios').default
  const test = {

    GET: (path,...etc) => axios.get (test.url+path,...etc) .catch(_error),
    PUT: (path,...etc) => axios.put (test.url+path,...etc) .catch(_error),
    POST: (path,...etc) => axios.post (test.url+path,...etc) .catch(_error),
    PATCH: (path,...etc) => axios.patch (test.url+path,...etc) .catch(_error),
    DELETE: (path,...etc) => axios.delete (test.url+path,...etc) .catch(_error),

    get: (path,...etc) => axios.get (test.url+path,...etc) .catch(_error),
    put: (path,...etc) => axios.put (test.url+path,...etc) .catch(_error),
    post: (path,...etc) => axios.post (test.url+path,...etc) .catch(_error),
    patch: (path,...etc) => axios.patch (test.url+path,...etc) .catch(_error),
    delete: (path,...etc) => axios.delete (test.url+path,...etc) .catch(_error),

    get chai(){ return lazy.chai },
    get expect(){ return lazy.expect },
    get assert(){ return lazy.assert },
  }

  // launch cds server...
  before (done => {

    const cds = require('@sap/cds'), { isdir } = cds.utils

    let cmd = 'run'
    if (project.startsWith('cds ')) [ cmd, project ] = [ project.slice(4), args.shift() ]
    if (!args.length) args = ['--in-memory?']

    // Supporting .launch (<package name>)
    if (cmd === 'run') {
      if (isdir(project)) ; //> all fine
      else if (isdir(resolve(this.root,project))) project = resolve(this.root,project)
      else try { project = dirname (require.resolve(project+'/package.json')) }
      catch(e) { throw cds.error (`Cannot resolve project folder for '${project}'`) }
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
    throw new Error (code && code !== 'null' ? `${code} - ${message}` : message)
  }

  return test
}
