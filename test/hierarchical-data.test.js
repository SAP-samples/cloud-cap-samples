const cwd = process.cwd(); process.chdir (__dirname) //> only for internal CI/CD@SAP
const {expect} = require('./capire')
const cds = require ('@sap/cds')

const model = cds.parse(`
  entity Categories {
    key ID   : Integer;
    name     : String;
    children : Composition of many Categories on children.parent = $self;
    parent   : Association to Categories;
  }
`)
const {Categories:Cats} = model.definitions


describe('Hierarchical Data', ()=>{

	before ('bootstrap sqlite in-memory db...', async()=>{
		await cds.deploy (model) .to ('sqlite::memory:')
		expect (cds.db) .to.exist
    expect (cds.db.model) .to.exist
	})

	after(()=> process.chdir(cwd))

	it ('supports deeply nested inserts', ()=> INSERT.into (Cats,
    { ID:100, name:'Some Cats...', children:[
      { ID:101, name:'Cat', children:[
        { ID:102, name:'Kitty', children:[
          { ID:103, name:'Kitty Cat', children:[
            { ID:104, name:'Aristocat' } ]},
          { ID:105, name:'Kitty Bat' } ]},
        { ID:106, name:'Catwoman', children:[
          { ID:107, name:'Catalina' } ]} ]},
      { ID:108, name:'Catweazle' }
    ]}
  ))

	it ('supports nested reads', async()=>{
		expect (await
			SELECT.one.from (Cats, c=>{
				c.ID, c.name.as('parent'), c.children (c=>{
					c.name.as('child')
				})
			}) .where ({name:'Cat'})
		) .to.eql (
			{ ID:101, parent:'Cat', children:[
				{ ID:102, child:'Kitty' },
				{ ID:106, child:'Catwoman' },
			]}
		)
	})

	it ('supports deeply nested reads', async()=>{
		expect (await SELECT.one.from (Cats, c=>{
			c.ID, c.name, c.children (
				c => { c.name },
				{levels:3}
			)
		}) .where ({name:'Cat'})
		) .to.eql (
			{ ID:101, name:'Cat', children:[
				{ ID:102, name:'Kitty', children:[
					{ ID:103, name:'Kitty Cat', children:[
						{ ID:104, name:'Aristocat' }, ]},  // level 3
					{ ID:105, name:'Kitty Bat', children:[] }, ]},
				{ ID:106, name:'Catwoman', children:[
					{ ID:107, name:'Catalina', children:[] } ]},
			]}
		)
	})

	it ('supports cascaded deletes', async()=>{
    const affectedRows = await DELETE.from (Cats) .where ({ID:[102,106]})
    expect (affectedRows) .to.equal (5)
    expect ( await SELECT.from(Cats) ).to.eql ([
      { ID:100, name:'Some Cats...' },
      { ID:101, name:'Cat' },
        { ID:104, name:'Aristocat' },  // REVISIT: Should be deleted as well?
      { ID:108, name:'Catweazle' }
    ])
	})

})
