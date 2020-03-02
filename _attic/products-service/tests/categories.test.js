const cds = require ('@sap/cds')

describe('reading/writing hierarchies', ()=>{

    it ('should prepare to sqlite in-memory', async()=>{
        await cds.deploy (__dirname+'/../db') .to ('sqlite::memory:')
        expect (cds.model) .toBeDefined()
    })

    it ('should insert hierarchy of categories', ()=>{
        const { Categories } = cds.entities
        return INSERT.into (Categories) .entries (
            { ID:100, name:'Some Sample Categories...', children:[
                { ID:101, name:'Cat', children:[
                    { ID:102, name:'Kitty', children:[
                        { ID:103, name:'Kitty Cat', children:[
                            { ID:104, name:'Aristocat' } ]},
                        { ID:105, name:'Kitty Bat' } ]},
                    { ID:106, name:'Catwoman', children:[
                        { ID:107, name:'Catalina' } ]} ]},
                { ID:108, name:'Catweazle' }
            ]}
        )
    })

    it ('should read categories with children', async()=>{
        const { Categories } = cds.entities
        expect (await

            SELECT.one.from (Categories, c=>{
                c.ID, c.name.as('parent'), c.children (c=>{
                    c.name.as('child')
                })
            }) .where ({name:'Cat'})

        ) .toMatchObject (

            { ID:101, parent:'Cat', children:[
                { child:'Kitty' },
                { child:'Catwoman' },
            ]}

        )
    })

    it ('should read hierarchy of categories', async()=>{
        const { Categories } = cds.entities
        expect (await

            SELECT.one.from (Categories, c=>{
                c.ID, c.name, c.children (c=>{ c.name },{levels:3})
            }) .where ({name:'Cat'})

        ) .toMatchObject (

            { ID:101, name:'Cat', children:[
                { name:'Kitty', children:[
                    { name:'Kitty Cat', children:[
                        { name:'Aristocat' }, ]},
                    { name:'Kitty Bat' }, ]},
                { name:'Catwoman', children:[
                    { name:'Catalina' } ]},
            ]}

        )
    })

})
