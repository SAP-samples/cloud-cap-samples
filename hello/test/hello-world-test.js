const cds = require ('@sap/cds')
describe('Hello world!', () => {

    beforeAll (()=> process.env.CDS_TYPESCRIPT = true)
    afterAll (()=> delete process.env.CDS_TYPESCRIPT)
    const {GET} = cds.test.in(__dirname,'../srv').run('serve', 'world.cds')

    it('should say hello with class impl', async () => {
        const {data} = await GET`/say/hello(to='world')`
        expect(data.value).toMatch(/Hello world.*typescript.*/i)
    })

})
