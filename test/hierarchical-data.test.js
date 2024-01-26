const cds = require('@sap/cds/lib')
const { expect } = cds.test.in(__dirname,'..')

describe('cap/samples - Hierarchical Data', ()=>{

	const csn = CDL`
		entity Categories {
			key ID   : Integer;
			name     : String;
			children : Composition of many Categories on children.parent = $self;
			parent   : Association to Categories;
		}
	`
	const model = cds.compile.for.nodejs(csn)
	const {Categories:Cats} = model.definitions

	before ('bootstrap sqlite in-memory db...', async()=>{
		await cds.deploy (csn) .to ('sqlite::memory:') // REVISIT: cds.compile.to.sql should accept cds.compiled.for.nodejs models
		expect (cds.db) .to.exist
		expect (cds.db.model) .to.exist
	})

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
		if (require('semver').gte(cds.version, '5.9.0')) {
			expect (await
				SELECT.one.from (Cats, c=>{
					c.ID, c.name.as('parent'), c.children (c=>{
						c.name.as('child')
					})
				}) .where ({name:'Cat'})
			) .to.eql (
				{ ID:101, parent:'Cat', children:[
					{ child:'Kitty' },
					{ child:'Catwoman' },
				]}
			)
			return
		}
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
		if (require('semver').gte(cds.version, '5.9.0')) {
			expect (await SELECT.one.from (Cats, c=>{
				c.ID, c.name, c.children (
					c => { c.name },
					{levels:3}
				)
			}) .where ({name:'Cat'})
			) .to.eql (
				{ ID:101, name:'Cat', children:[
					{ name:'Kitty', children:[
						{ name:'Kitty Cat', children:[
							{ name:'Aristocat' }, ]},  // level 3
						{ name:'Kitty Bat', children:[] }, ]},
					{ name:'Catwoman', children:[
						{ name:'Catalina', children:[] } ]},
				]}
			)
			return
		}
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
		expect (affectedRows) .to.be.greaterThan (0)
		const expected = [
			{ ID:100, name:'Some Cats...' },
			{ ID:101, name:'Cat' },
			{ ID:108, name:'Catweazle' }
		]
		expect ( await SELECT`ID,name`.from(Cats) ).to.eql (expected)
	})

})
