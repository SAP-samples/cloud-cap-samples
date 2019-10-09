const {load,intercept} = require ('../srv/code-lists')
const cds = require ('@sap/cds')

// patch-enhance cds.ql
const select = SELECT.from('.').__proto__.__proto__, query = select.__proto__
query.then = function (r,e) { return db.run(this) .then (r,e || ((e)=>{throw e})) }

let db, Countries, Australia = {
    name: 'Australia', descr: 'Commonwealth of Australia', texts: {
        de: { name: 'Australien', descr: 'Commonwealth Australien' }
    }
}

describe ('code list tests', ()=>{

    it ('should deploy the db schema to sqlite in-memory', async()=>{
        db = await cds.deploy (__dirname) .to ('sqlite::memory:', {silent:true,primary:true})
        Countries = db.model.entities ['sap.common.Countries']
        expect (Countries) .toBeDefined()
    })

    it ('should read Countries', async()=>{
        const countries = await SELECT ('code','name') .from (Countries)
        expect (countries) .toContainEqual ({ code: 'AU', name: 'Australia' })
    })

    it ('should read Countries_texts', async()=>{
        const countries = await SELECT ('locale','code','name') .from ('sap.common.Countries_texts')
        expect (countries) .toContainEqual ({ locale: 'de', code: 'AU', name: 'Australien' })
    })

    it ('should read code lists with translated texts', async()=>{
        const {AU} = await load (Countries)
        expect (AU) .toEqual (Australia)
    })

    cds.env.singletenant = true

    it ('should serve services with localized data', async()=>{
        const { Sue:sue } = await cds.serve (__dirname)
        const { Foos } = sue.entities
        await sue.create (Foos) .entries ({country:'Avalon'})
        await sue.create (Foos) .entries ({country:'AU'})
        expect (await sue.read('Foos')) .toEqual ([ { ID: 1, country: 'Avalon' }, { ID: 2, country: 'AU' } ])
    })

    it ('should resolve countries', async()=>{
        const sue = await cds.connect.to ('Sue')
        await intercept (sue)
        expect (await sue.read('Foos')) .toEqual ([ { ID: 1, country: 'Avalon' }, { ID: 2, country: 'Australia' } ])
        intercept.locale = 'de'
        expect (await sue.read('Foos')) .toEqual ([ { ID: 1, country: 'Avalon' }, { ID: 2, country: 'Australien' } ])
        console.log (await sue.read('Foos'))
    })

    it ('should read countries with expand to translated texts', async()=>{
        // FIXME: requires
        // https://github.wdf.sap.corp/cdx/cds-sql/pull/410 and
        // https://github.wdf.sap.corp/cdx/cds-services/pull/782
        // const countries = await cds.read (Countries, c=>{
        const countries = await cds.run (SELECT.from (Countries, c=>{
            c.name, c.texts (t => {
                t.locale, t.name
            })
        }))
        console.log (countries)
    })

    it ('should disconnect from db', ()=> db.disconnect())
    //> FIXME: that should not be required!

})
