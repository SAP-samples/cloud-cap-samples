const cds = module.exports = require('@sap/cds/lib')
if (!cds.test) { // monkey patching cds

  const { resolve, dirname } = require('path')
  const cwd = process.cwd()

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

  // eslint-disable-next-line no-global-assign
  require = (mod) => {
    try { return module.require(mod) }
    catch(e) { if (e.code === 'MODULE_NOT_FOUND') throw new Error (`
      Failed to load required package '${mod}'. Please add it thru:
      npm add -D ${mod === 'chai' ? 'chai chai-as-promised chai-subset' : mod}
    `) }
  }



  class Test {

    /**
     * Launches a cds server with arbitrary port and returns a subclass which
     * also acts as an axios lookalike, providing methods to send requests.
     * @returns {Test}
     */
    static run (cmd, ...args) {

      // Setting up test server
      const console = global.console, logs=[]
      const axios = require('axios').default
      const test = {__proto__:Test.run,

        GET: (path,...etc) => axios.get (test.url+path,...etc) .catch(_error),
        PUT: (path,...etc) => axios.put (test.url+path,...etc) .catch(_error),
        POST: (path,...etc) => axios.post (test.url+path,...etc) .catch(_error),
        PATCH: (path,...etc) => axios.patch (test.url+path,...etc) .catch(_error),
        DEL: (path,...etc) => axios.delete (test.url+path,...etc) .catch(_error),

        get: (path,...etc) => axios.get (test.url+path,...etc) .catch(_error),
        put: (path,...etc) => axios.put (test.url+path,...etc) .catch(_error),
        post: (path,...etc) => axios.post (test.url+path,...etc) .catch(_error),
        patch: (path,...etc) => axios.patch (test.url+path,...etc) .catch(_error),
        delete: (path,...etc) => axios.delete (test.url+path,...etc) .catch(_error),

      }

      // launch cds server...
      before (`launching ${cmd} ${args.join(' ')}...`, done => {

        // const cds = require('../index'),
        const { isdir } = cds.utils
        if (!args.length) {
          let project = cmd; cmd = 'run'
          if (isdir(project)) ; //> all fine
          // Supporting .launch (<package name>)
          else if (isdir(resolve(project))) project = resolve(project)
          else try { project = dirname (require.resolve(project+'/package.json')) }
          catch(e) { throw cds.error (`Cannot resolve project folder for '${project}' in '${process.cwd()}'`) }
          args.push (project, '--in-memory?')
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
        const p = cds.exec (cmd, ...args) // TODO w/ @sap/cds@3.33.3: , '--port', '0')
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
        if (cwd !== process.cwd())  process.chdir(cwd)
        test.server ? test.server.close (done) : done()
        process.emit('shutdown')
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

    /**
     * Serving projects from subfolders under the root specified by a sequence
     * of path components which are concatenated with path.resolve().
     */
    in (...paths) {
      process.chdir (resolve (...paths))
      return this
    }

    /**
     * Switch on/off console log output.
     */
    verbose(v) {
      process.env.CDS_TEST_VERBOSE = v
      return this
    }

    /** Lazily loads and returns an instance of chai */
    get chai() {
      const chai = require('chai')
      chai.use (require('chai-subset'))
      chai.use (require('chai-as-promised'))
      Object.defineProperty (this, 'chai', {value:chai})
      return chai
    }
    get expect(){ return this.chai.expect }
    get assert(){ return this.chai.assert }
  }


  /**
   * Test kit for jest or mocha testing, which can be used statically
   * via the getters for chai, expect and assert or through a server
   * started with cds.test(...).
   * @type Test.run & Test
   */
  Object.defineProperties (Test.run, Object.getOwnPropertyDescriptors (Test.prototype))
  Object.defineProperty (cds, 'test', {value:Test.run})
  const cds_load = cds.load; cds.load = (models,o)=>{
    if (typeof models === 'string')  models = models.split(',')
    return cds_load.call(cds,models,o)
  }

}
