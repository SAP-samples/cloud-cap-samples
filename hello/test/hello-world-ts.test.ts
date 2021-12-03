process.env.CDS_TYPESCRIPT = 'true';
import * as cds from '@sap/cds';

//@ts-ignore to avoid "Property 'test' does not exist on type 'cds_facade'.ts(2339)"
const {GET} = cds.test.in(__dirname,'../src/srv').run('serve', 'world.cds');

describe('Hello world!', () => {
    afterAll(() => { delete process.env.CDS_TYPESCRIPT; });

    it('should say hello with class impl from a TypeScript file', async () => {
        const {data} = await GET`/say/hello(to='world')`
        expect(data.value).toMatch(/Hello world.*TypeScript.*/i)
    })

})
