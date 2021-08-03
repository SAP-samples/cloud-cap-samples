process.env.CDS_TYPESCRIPT = 'true';
import * as cds from '@sap/cds';

//@ts-ignore
const {GET} = cds.test.in(__dirname,'../srv').run('serve', 'world.cds');

describe('Hello world!', () => {
    afterAll(() => { delete process.env.CDS_TYPESCRIPT; });

    it('should say hello with class impl from a typescript file', async () => {
        const {data} = await GET`/say/hello(to='world')`
        expect(data.value).toMatch(/Hello world.*typescript.*/i)
    })

})
