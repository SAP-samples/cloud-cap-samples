const testKit = require('../test')
process.env.TYPESCRIPT_SUPPORT = 'true';

const {GET} = testKit.run('serve', 'hello/world.cds')

describe('Hello world!', () => {

    it('should say hello with class impl from a typescript file', async () => {
        const {data} = await GET`/say/hello(to='world')`
        expect(data.value).toEqual('Hello world from a typescript file!')
    })

})
