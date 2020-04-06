////////////////////////////////////////////////////////////////////////////
//
//  This is included with cds in newer versions
//
////////////////////////////////////////////////////////////////////////////

const { resolve, dirname } = require('path')

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

/**
 * Test kit for jest or mocha testing, which can be used statically
 * via the getters for chai, expect and assert or through a server
 * started with .launch(...).
 */
class CDSTestKit {

  /**
   * Creates a new instance serving projects from subfolders under the root
   * specified by a sequence of path components which are concatenated with
   * path.resolve().
   */
  for (...paths) {
    const tk = new CDSTestKit
    tk.root = resolve (...paths)
    return tk
  }

  /** Lazily loads and returns an instance of chai */
  get chai() {
    const chai = require('chai')
    chai.use (require('chai-as-promised'))
    chai.use (require('chai-subset'))
    chai.should()
    Object.defineProperty (CDSTestKit.prototype, 'chai', {value:chai})
    return chai
  }
  get expect(){ return this.chai.expect }
  get assert(){ return this.chai.assert }

  /**
   * Launches a cds server with arbitrary port and returns a subclass which
   * also acts as an axios lookalike, providing methods to send requests.
   */
  launch (project, ...args) {

    // Setting up test server
    const console = global.console, logs=[]
    const axios = require('axios').default
    const lazy = this, test = {

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

      /** Lazily loads and returns an instance of chai */
      get chai(){ return lazy.chai },
      get expect(){ return lazy.expect },
      get assert(){ return lazy.assert },
    }

    // launch cds server...
    before (`launching cds server for ${project}...`, done => {

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

}

// eslint-disable-next-line no-global-assign
require = (mod) => {
  try { return module.require(mod) }
  catch(e) { if (e.code === 'MODULE_NOT_FOUND') throw new Error (`
    Failed to load required package '${mod}'. Please add it thru:
    npm add -D ${mod === 'chai' ? 'chai chai-as-promised chai-subset' : mod}
  `) }
}

module.exports = new CDSTestKit
exports.root = __dirname
