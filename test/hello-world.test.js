const cds = require('@sap/cds/lib')
const { GET, expect } = cds.test (__dirname+'/../hello')

describe('cap/samples - Hello world!', () => {

  it('should say hello with class impl', async () => {
    const {data} = await GET `/say/hello(to='world')`
    expect(data.value).to.eql('Hello world!')
  })

  it('should say hello with another impl', async () => {
    await cds.serve('say').from(cds.model)
    .at('/say-again').in(cds.app)
    .with(srv => {
      srv.on('hello', (req) => `Hello again ${req.data.to}!`)
    })
    const {data} = await GET `/say-again/hello(to='world')`
    expect(data.value).to.eql('Hello again world!')
  })

})
