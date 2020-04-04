const {expect} = require('@capire/tests')
const cds = require ('@sap/cds')

describe('Hierarchical CodeLists', ()=>{

    it ('should bootstrap sqlite in-memory db...', async()=>{
        await cds.deploy ('@capire/bookshop') .to ('sqlite::memory:')
        expect (cds.db) .to.exist
        expect (cds.db.model) .to.exist
    })

    it ('should insert hierarchy of genres', ()=>{
        const { Genres } = cds.entities
        return INSERT.into (Genres) .entries (
            { ID:100, name:'Some Sample Genres...', children:[
                { ID:101, name:'Cat', children:[
                    { ID:102, name:'Kitty', children:[
                        { ID:103, name:'Kitty Cat', children:[
                            { ID:104, name:'Aristocat' } ]},
                        { ID:105, name:'Kitty Bat' } ]},
                    { ID:106, name:'Catwoman', children:[
                        { ID:107, name:'Catalina' } ]} ]},
                { ID:108, name:'Ca<tweazle' }
            ]}
        )
    })

    it ('should read genres with children', async()=>{
        const { Genres } = cds.entities
        expect (await

            SELECT.one.from (Genres, c=>{
                c.ID, c.name.as('parent'), c.children (c=>{
                    c.name.as('child')
                })
            }) .where ({name:'Cat'})

        ) .to.containSubset (

            { ID:101, parent:'Cat', children:[
                { child:'Kitty' },
                { child:'Catwoman' },
            ]}

        )
    })

    it ('should read deep hierarchy of genres', async()=>{
        const { Genres } = cds.entities
        expect (await

            SELECT.one.from (Genres, c=>{
                c.ID, c.name, c.children (c=>{ c.name },{levels:3})
            }) .where ({name:'Cat'})

        ) .to.containSubset (

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
