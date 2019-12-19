const cds = require('@sap/cds/lib/cds')
const run = require('@sap/cds/bin/run')

let testServer
const cwd = process.cwd()

const setup = (model, done) => {
  cds.once('listening', ({ server }) => {
    testServer = server
    done()
  })
  run([model], { 'in-memory?': true })
}

const close = done => {
  testServer.close(done)
  process.chdir(cwd)
}

module.exports = {
  setup,
  close
}