
const cds = require('@sap/cds/lib')
const { expect } = cds.test
const { fork } = require('child_process')
const { resolve } = require('path')
const verbose = process.env.CDS_TEST_VERBOSE
// ||true

describe('Local NPM registry', () => {
  let registry
  let axios
  const cwd = resolve(__dirname, '..')

  before(async ()=> {
    const env = Object.assign(process.env, {PORT:'0'})
    const res = await exec (resolve(cwd, '.registry/server.js'), {cwd, stdio: 'pipe', env})
    registry = res.cp
    axios = require('axios').default.create ({ baseURL: res.url, validateStatus: (status)=>status<500 })
  })

  after(() => { registry.kill() })

  for (const mod of ['bookshop','fiori','orders','reviews']) {
    it(`should serve ${mod}`, async () => {
      const resp = await axios.get(`/@capire/${mod}`)
      expect(resp.data).to.containSubset({name: `@capire/${mod}`, versions:{}})
      const versions = Object.values(resp.data.versions)
      await axios.get(versions[0].dist.tarball)
    })
  }
  it(`should return 404 for unknown packages`, async () => {
    let resp = await axios.get(`/@capire/foo`)
    expect(resp.status).to.equal(404)
    resp = await axios.get(`/foo`)
    expect(resp.status).to.equal(404)
  })

})

function exec (script, opts) {
  return new Promise((resolve, reject)=> {
    const cp = fork (script, [], opts)
      .on('error', err => reject(new Error(err)))
    cp.stdout.on('data', chunk => {
      if (verbose) console.log(chunk.toString())
      if (chunk.toString().match(/listening.*(http:.*:\d+)/i)) {
         resolve({cp, url:RegExp.$1})
      }
    })
    cp.stderr.on('data', chunk => {
      if (verbose)  console.error(chunk.toString())
    })
  })

}
