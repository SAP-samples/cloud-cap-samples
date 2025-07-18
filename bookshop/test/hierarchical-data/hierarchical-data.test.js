const cds = require('@sap/cds')
const { expect } = cds.test.in(__dirname,'..','..')

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

	it ('should generate correct queries for expands', ()=>{
		let q = SELECT.from (Cats, c => { c.ID, c.name, c.children (c => c.name) })
		expect (q) .to.eql ({
			SELECT: {
				from: { ref:[ "Categories" ] },
				columns: [
					{ ref: [ "ID" ] },
					{ ref: [ "name" ] },
					{ ref: [ "children" ], expand: [ {ref:['name']} ] },
				]
			}
		})
		/* temp skip for release
		if (q.forSQL) expect (q.forSQL()) .to.eql ({
			SELECT: {
				from: { ref:[ "Categories" ], as: "Categories" },
				columns: [
					{ ref: [ "Categories", "ID" ] },
					{ ref: [ "Categories", "name" ] },
					{ as: "children", SELECT: { expand: true,
						one: false,
						columns: [{ ref: [ "children", "name" ]}],
						from: { ref:["Categories"], as: "children" },
						where: [
							{ref:[ "Categories", "ID" ]}, "=", {ref:[ "children", "parent_ID" ]}
						],
					}},
				],
			}
		})
		if (q.toSql) expect (q.toSql()) .to.eql (
			`SELECT json_insert('{}',` +
				`'$."ID"',ID,` +
				`'$."name"',name,` +
				`'$."children"',children->'$'` +
			`) as _json_ FROM (` +
				`SELECT Categories.ID,Categories.name,(` +
					`SELECT jsonb_group_array(jsonb_insert('{}','$."name"',name)) as _json_ FROM (` +
						`SELECT children.name FROM Categories as children WHERE Categories.ID = children.parent_ID` +
					`)` +
				`) as children FROM Categories as Categories` +
			`)`
		)
		*/
	})

	it ('supports nested reads', ()=> expect (
		SELECT.one.from (Cats, c=>{
			c.ID, c.name.as('parent'), c.children (c=>{
				c.name.as('child')
			})
		}) .where ({name:'Cat'})
	) .to.eventually.eql (
		{ ID:101, parent:'Cat', children:[
			{ child:'Kitty' },
			{ child:'Catwoman' },
		]}
	))

	it ('supports deeply nested reads', ()=> expect (
		SELECT.one.from (Cats, c=>{
			c.ID, c.name, c.children (
				c => { c.name },
				{levels:3}
			)
		}) .where ({name:'Cat'})
	) .to.eventually.eql (
		{ ID:101, name:'Cat', children:[
			{ name:'Kitty', children:[
				{ name:'Kitty Cat', children:[
					{ name:'Aristocat' }, ]},  // level 3
				{ name:'Kitty Bat', children:[] }, ]},
			{ name:'Catwoman', children:[
				{ name:'Catalina', children:[] } ]},
		]}
	))

	it ('supports cascaded deletes', async()=>{
		const affectedRows = await DELETE.from (Cats) .where ({ID:[102,106]})
		expect (affectedRows) .to.be.greaterThan (0)
		await expect (SELECT`ID,name`.from(Cats) ).to.eventually.eql ([
			{ ID:100, name:'Some Cats...' },
			{ ID:101, name:'Cat' },
			{ ID:108, name:'Catweazle' }
		])
	})

})
