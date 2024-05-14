const cds = require ('@sap/cds')
describe('Hello world!', () => {
    const {GET} = cds.test.in(__dirname,'../srv').run('serve', 'world.cds')

    it('should say hello with class impl', async () => {
        const {data} = await GET`/say/hello(to='world')`
        expect(data.value).to.match(/Hello world.*typescript.*/i)
    })

})
