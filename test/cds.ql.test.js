const cds = require('@sap/cds/lib')
const { expect } = cds.test

describe('cds.ql → cqn', () => {

  const Foo = { name: 'Foo' }
  const Books = { name: 'capire.bookshop.Books' }

  const STAR = '*'
  const skip = {to:{eql:()=>skip}}
  const srv = new cds.Service
  let cqn

  expect.plain = (cqn) => !cqn.SELECT.one && !cqn.SELECT.distinct ? expect(cqn) : skip
  expect.one = (cqn) => !cqn.SELECT.distinct ? expect(cqn) : skip

  describe.each(['SELECT', 'SELECT one', 'SELECT distinct'])(`%s...`, (each) => {

    let SELECT; beforeEach(()=> SELECT = (
      each === 'SELECT distinct' ? cds.ql.SELECT.distinct :
      each === 'SELECT one' ? cds.ql.SELECT.one :
      cds.ql.SELECT
    ))

    test(`from Foo`, () => {
      expect(cqn = SELECT `from Foo`)
      .to.eql(SELECT.from `Foo`)
      .to.eql(SELECT.from('Foo'))
      .to.eql(SELECT.from(Foo))
      .to.eql(SELECT`Foo`)
      .to.eql(SELECT('Foo'))
      .to.eql(SELECT(Foo))
      expect.plain(cqn)
      .to.eql(CQL`SELECT from Foo`)
      .to.eql(srv.read `Foo`)
      .to.eql(srv.read('Foo'))
      .to.eql(srv.read(Foo))
      .to.eql({
        SELECT: { from: { ref: ['Foo'] } },
      })
    })

    if (each === 'SELECT')
    test('SELECT ( Foo )', () => {
      expect({
        SELECT: { from: { ref: ['Foo'] } },
      })
      .to.eql(CQL`SELECT from Foo`)
      .to.eql(SELECT(Foo))
    })

    if (each === 'SELECT')
    test('SELECT ( Foo ) .from ( Bar )', () => {

      expect({
        SELECT: { columns:[{ref:['Foo']}], from: { ref: ['Bar'] } },
      })
      .to.eql(CQL`SELECT Foo from Bar`)
      .to.eql(SELECT `Foo` .from `Bar`)
      .to.eql(SELECT `Foo` .from('Bar'))
      .to.eql(SELECT('Foo').from('Bar'))
      .to.eql(SELECT(['Foo']).from('Bar'))
      .to.eql(SELECT(['Foo']).from('Bar'))
      .to.eql(SELECT `Bar` .columns `Foo`)
      .to.eql(SELECT `Bar` .columns ('Foo'))
      .to.eql(SELECT `Bar` .columns (['Foo']))
      .to.eql(SELECT.from `Bar` .columns ('Foo'))
      .to.eql(SELECT.from `Bar` .columns (['Foo']))

      expect({
        SELECT: { columns:[
          {ref:['Foo']},
          {ref:['Boo']},
        ], from: { ref: ['Bar'] } },
      })
      .to.eql(CQL`SELECT Foo, Boo from Bar`)
      .to.eql(SELECT `Foo, Boo` .from `Bar`)
      .to.eql(SELECT `Foo, Boo` .from('Bar'))
      .to.eql(SELECT('Foo','Boo').from('Bar'))
      .to.eql(SELECT(['Foo','Boo']).from('Bar'))
      .to.eql(SELECT `Bar` .columns `Foo, Boo`)
      .to.eql(SELECT `Bar` .columns `{ Foo, Boo }`)
      .to.eql(SELECT `Bar` .columns ('{ Foo, Boo }'))
      .to.eql(SELECT `Bar` .columns ('Foo','Boo'))
      .to.eql(SELECT `Bar` .columns (['Foo','Boo']))
      .to.eql(SELECT.from `Bar` .columns ('Foo','Boo'))
      .to.eql(SELECT.from `Bar` .columns (['Foo','Boo']))

      expect({
        SELECT: { columns:[
          {ref:['Foo']},
          {ref:['Boo']},
          {ref:['Moo']},
        ], from: { ref: ['Bar'] } },
      })
      .to.eql(CQL`SELECT Foo, Boo, Moo from Bar`)
      .to.eql(SELECT `Foo, Boo, Moo` .from `Bar`)
      .to.eql(SELECT `Foo, Boo, Moo` .from('Bar'))
      .to.eql(SELECT('Foo','Boo','Moo').from('Bar'))
      .to.eql(SELECT(['Foo','Boo','Moo']).from('Bar'))
      .to.eql(SELECT `Bar` .columns `Foo, Boo, Moo`)
      .to.eql(SELECT `Bar` .columns ('Foo','Boo','Moo'))
      .to.eql(SELECT `Bar` .columns (['Foo','Boo','Moo']))
      .to.eql(SELECT.from `Bar` .columns ('Foo','Boo','Moo'))
      .to.eql(SELECT.from `Bar` .columns (['Foo','Boo','Moo']))


      expect({
        SELECT: { one:true, columns:[{ref:['Foo']}], from: { ref: ['Bar'] } },
      })
      // .to.eql(CQL`SELECT one Foo from Bar`)
      .to.eql(SELECT.one `Foo` .from `Bar`)
      .to.eql(SELECT.one `Foo` .from('Bar'))
      .to.eql(SELECT.one('Foo').from('Bar'))
      .to.eql(SELECT.one(['Foo']).from('Bar'))
      .to.eql(SELECT.one(['Foo']).from('Bar'))
      .to.eql(SELECT.one('Bar',['Foo']))
      .to.eql(SELECT.one `Bar` .columns `Foo`)
      .to.eql(SELECT.one('Bar').columns('Foo'))
      .to.eql(SELECT.one('Bar').columns(['Foo']))
      .to.eql(SELECT.one.from('Bar',['Foo']))
      .to.eql(SELECT.one.from('Bar').columns('Foo'))
      .to.eql(SELECT.one.from('Bar').columns(['Foo']))

      expect({
        SELECT: { one:true, columns:[
          {ref:['Foo']},
          {ref:['Boo']},
        ], from: { ref: ['Bar'] } },
      })
      // .to.eql(CQL`SELECT Foo, Boo from Bar`)
      .to.eql(SELECT.one `Foo, Boo` .from `Bar`)
      .to.eql(SELECT.one `Foo, Boo` .from('Bar'))
      .to.eql(SELECT.one('Foo','Boo').from('Bar'))
      .to.eql(SELECT.one(['Foo','Boo']).from('Bar'))
      .to.eql(SELECT.one('Bar',['Foo','Boo']))
      .to.eql(SELECT.one `Bar` .columns `Foo, Boo`)
      .to.eql(SELECT.one('Bar').columns('Foo','Boo'))
      .to.eql(SELECT.one('Bar').columns(['Foo','Boo']))
      .to.eql(SELECT.one.from('Bar',['Foo','Boo']))
      .to.eql(SELECT.one.from('Bar').columns('Foo','Boo'))
      .to.eql(SELECT.one.from('Bar').columns(['Foo','Boo']))

      expect({
        SELECT: { one:true, columns:[
          {ref:['Foo']},
          {ref:['Boo']},
          {ref:['Moo']},
        ], from: { ref: ['Bar'] } },
      })
      // .to.eql(CQL`SELECT Foo, Boo, Moo from Bar`)
      .to.eql(SELECT.one `Foo, Boo, Moo` .from `Bar`)
      .to.eql(SELECT.one `Foo, Boo, Moo` .from('Bar'))
      .to.eql(SELECT.one('Foo','Boo','Moo').from('Bar'))
      .to.eql(SELECT.one(['Foo','Boo','Moo']).from('Bar'))
      .to.eql(SELECT.one('Bar',['Foo','Boo','Moo']))
      .to.eql(SELECT.one `Bar` .columns `Foo, Boo, Moo`)
      .to.eql(SELECT.one('Bar').columns('Foo','Boo','Moo'))
      .to.eql(SELECT.one('Bar').columns(['Foo','Boo','Moo']))
      .to.eql(SELECT.one.from('Bar',['Foo','Boo','Moo']))
      .to.eql(SELECT.one.from('Bar').columns('Foo','Boo','Moo'))
      .to.eql(SELECT.one.from('Bar').columns(['Foo','Boo','Moo']))

    })

    if (each === 'SELECT')
    test('from ( Foo )', () => {
      expect({
        SELECT: { from: {ref: [{ id:'Foo', where: [{val:11}] }] }}
      })
      .to.eql(srv.read`Foo[${11}]`)
      .to.eql(SELECT`Foo[${11}]`)

      expect((cqn = SELECT`from Foo[ID=11]`))
      .to.eql(SELECT`from Foo[ID=${11}]`)
      .to.eql(SELECT.from `Foo[ID=11]`)
      .to.eql(SELECT.from `Foo[ID=${11}]`)
      .to.eql(SELECT`Foo[ID=11]`)
      expect.plain(cqn)
      .to.eql(CQL`SELECT from Foo[ID=11]`)
      .to.eql(srv.read`Foo[ID=11]`)
      .to.eql({
        SELECT: { from: {
          ref: [{ id: 'Foo', where: [{ ref: ['ID'] }, '=', { val: 11 }] }],
        }},
      })

      expect.plain (cqn)
      .to.eql(SELECT`Foo[ID=${11}]`)
      .to.eql(srv.read`Foo[ID=${11}]`)

      // Following implicitly resolve to SELECT.one
      expect(cqn = SELECT.from(Foo,11))
      .to.eql(SELECT.from(Foo,{ID:11}))
      .to.eql(SELECT.from(Foo).byKey(11))
      .to.eql(SELECT.from(Foo).byKey({ID:11}))
      if (cds.version >= '5.6.0') {
        expect.one(cqn)
        .to.eql({
          SELECT: {
            one: true,
            from: { ref: [{ id: 'Foo', where: [{ ref: ['ID'] }, '=', { val: 11 }] }] },
          },
        })
      } else {
        expect.one(cqn)
        .to.eql({
          SELECT: {
            one: true,
            from: { ref: ['Foo'] },
            where: [{ ref: ['ID'] }, '=', { val: 11 }],
          },
        })
      }

    })

    test('from Foo {...}', () => {

      expect(cqn = SELECT `*,a,b as c` .from `Foo`)
      .to.eql(SELECT `*,a,b as c`. from(Foo))
      .to.eql(SELECT('*','a',{b:'c'}).from`Foo`)
      .to.eql(SELECT('*','a',{b:'c'}).from(Foo))
      .to.eql(SELECT(['*','a',{b:'c'}]).from(Foo))
      .to.eql(SELECT.columns('*','a',{b:'c'}).from(Foo))
      .to.eql(SELECT.columns(['*','a',{b:'c'}]).from(Foo))
      .to.eql(SELECT.columns((foo) => { foo`.*`, foo.a, foo.b`as c` }).from(Foo))
      .to.eql(SELECT.columns((foo) => { foo('*'), foo.a, foo.b.as('c') }).from(Foo))
      .to.eql(SELECT.from(Foo).columns('*','a',{b:'c'}))
      .to.eql(SELECT.from(Foo).columns(['*','a',{b:'c'}]))
      .to.eql(SELECT.from(Foo).columns((foo) => { foo`.*`, foo.a, foo.b`as c` }))
      .to.eql(SELECT.from(Foo).columns((foo) => { foo('*'), foo.a, foo.b.as('c') }))
      .to.eql(SELECT.from(Foo,['*','a',{b:'c'}]))
      .to.eql(SELECT.from(Foo, (foo) => { foo`.*`, foo.a, foo.b`as c` }))
      .to.eql(SELECT.from(Foo, (foo) => { foo('*'), foo.a, foo.b.as('c') }))

      expect.plain(cqn)
      .to.eql({
        SELECT: {
          from: { ref: ['Foo'] },
          columns: [ STAR, { ref: ['a'] }, { ref: ['b'], as: 'c' }],
        },
      })

      expect.plain(cqn)
      .to.eql(CQL`SELECT *,a,b as c from Foo`)
      .to.eql(CQL`SELECT from Foo {*,a,b as c}`)

      // Test combination with key as second argument to .from
      expect(cqn = SELECT.from(Foo, 11, ['a']))
      .to.eql(SELECT.from(Foo, 11, foo => foo.a))

      if (cds.version >= '5.6.0') {
        expect.one(cqn)
        .to.eql({
          SELECT: {
            one: true,
            from: { ref: [{ id: 'Foo', where: [{ ref: ['ID'] }, '=', { val: 11 }]}] },
            columns: [{ ref: ['a'] }]
          },
        })
      } else {
        expect.one(cqn)
        .to.eql({
          SELECT: {
            one: true,
            from: { ref: ['Foo'] },
            columns: [{ ref: ['a'] }],
            where: [{ ref: ['ID'] }, '=', { val: 11 }],
          },
        })
      }

    })

    test('with nested expands', () => {
      // SELECT from Foo { *, x, bar.*, car{*}, boo { *, moo.zoo } }
      expect(cqn =
        SELECT.from (Foo, foo => {
          foo`*`, foo.x, foo.car`*`, foo.boo (b => {
            b`*`, b.moo.zoo(
              x => x.y.z
            )
          })
        })
      ).to.eql(
        SELECT.from (Foo, foo => {
          foo('*'), foo.x, foo.car('*'), foo.boo (b => {
            b('*'), b.moo.zoo(
              x => x.y.z
            )
          })
        })
      )

      expect.plain(cqn)
      .to.eql({
        SELECT: {
          from: { ref: ['Foo'] },
          columns: [
            STAR,
            { ref: ['x'] },
            { ref: ['car'], expand: ['*'] },
            {
              ref: ['boo'],
              expand: [ '*', { ref: ['moo', 'zoo'], expand: [{ ref: ['y', 'z'] }] }],
            },
          ],
        },
      })
    })


    test('with nested inlines', () => {
      // SELECT from Foo { *, x, bar.*, car{*}, boo { *, moo.zoo } }
      expect.plain(
        SELECT.from (Foo, foo => {
          foo.bar `*`,
          foo.bar `.*`, //> leading dot indicates inline
          foo.boo(_ => _.moo.zoo), //> underscore arg name indicates inline
          foo.boo(x => x.moo.zoo)
        })
      ).to.eql({
        SELECT: {
          from: { ref: ['Foo'] },
          columns: [
            { ref: ['bar'], expand: ['*'] },
            { ref: ['bar'], inline: ['*'] },
            { ref: ['boo'], inline: [{ ref: ['moo', 'zoo'] }] },
            { ref: ['boo'], expand: [{ ref: ['moo', 'zoo'] }] },
          ],
        },
      })
    })

  })

  describe ('SELECT where...', ()=>{

    it('should correctly handle { ... and:{...} }', () => {
      expect(SELECT.from(Foo).where({ x: 1, and: { y: 2, or: { z: 3 } } })).to.eql({
        SELECT: {
          from: { ref: ['Foo'] },
          where: [
            { ref: ['x'] },
            '=',
            { val: 1 },
            'and',
            // '(',
            {xpr:[
              { ref: ['y'] },
              '=',
              { val: 2 },
              'or',
              { ref: ['z'] },
              '=',
              { val: 3 },
            ]},
            // ')',
          ],
        },
      })
    })

    test ("where x='*'", ()=>{
      expect (SELECT.from(Foo).where({x:'*'}))
      .to.eql(SELECT.from(Foo).where("x='*'"))
      .to.eql(SELECT.from(Foo).where("x=",'*'))
      .to.eql(SELECT.from(Foo).where`x=${'*'}`)
      .to.eql(
        CQL`SELECT from Foo where x='*'`
      )
      expect (SELECT.from(Foo).where({x:['*',1]}))
      .to.eql(SELECT.from(Foo).where("x in ('*',1)"))
      .to.eql(SELECT.from(Foo).where("x in",['*',1]))
      .to.eql(SELECT.from(Foo).where`x in ${['*',1]}`)
      .to.eql(
        CQL`SELECT from Foo where x in ('*',1)`
      )
    })

    test ('where, and, or', ()=>{
      expect (
        SELECT.from(Foo).where({x:1,and:{y:2}})
      ).to.eql (
        CQL`SELECT from Foo where x=1 and y=2`
      ) .to.eql ({ SELECT: {
        from: {ref:['Foo']},
        where: [
          {ref:['x']}, '=', {val:1},
          'and',
          {ref:['y']}, '=', {val:2}
        ]
      }})

      const ql_with_groups_fix = !!cds.ql.Query.prototype.flat
      if (ql_with_groups_fix) {

        expect (
          SELECT.from(Foo).where({x:1}).or({y:2}).and({z:3})
        ).to.eql ({ SELECT: {
          from: {ref:['Foo']},
          where: [
            {ref:['x']}, '=', {val:1},
            'or',
            {ref:['y']}, '=', {val:2},
            'and',
            {ref:['z']}, '=', {val:3},
          ]
        }})

        expect (
          SELECT.from(Foo).where({x:1,or:{y:2}}).and({z:3})
        ).to.eql ({ SELECT: {
          from: {ref:['Foo']},
          where: [
            {xpr:[
              {ref:['x']}, '=', {val:1},
              'or',
              {ref:['y']}, '=', {val:2},
            ]},
            'and',
            {ref:['z']}, '=', {val:3},
          ]
        }})

        expect (
          SELECT.from(Foo).where({a:1}).or({x:1,or:{y:2}}).and({z:3})
        ).to.eql ({ SELECT: {
          from: {ref:['Foo']},
          where: [
            {ref:['a']}, '=', {val:1},
            'or',
            {xpr:[
              {ref:['x']}, '=', {val:1},
              'or',
              {ref:['y']}, '=', {val:2},
            ]},
            'and',
            {ref:['z']}, '=', {val:3},
          ]
        }})

        expect (
          { SELECT: SELECT.from(Foo).where({x:1,or:{y:2}}).SELECT }
        ).to.eql ({ SELECT: {
          from: {ref:['Foo']},
          where: [
            {ref:['x']}, '=', {val:1},
            'or',
            {ref:['y']}, '=', {val:2},
          ]
        }})

      }


      expect (
        SELECT.from(Foo).where({x:1,and:{y:2}}).or({z:3})
      ).to.eql (
        CQL`SELECT from Foo where x=1 and y=2 or z=3`
      )

      expect (
        SELECT.from(Foo).where({x:1}).and({y:2,or:{z:3}})
      ).to.eql (
        CQL`SELECT from Foo where x=1 and ( y=2 or z=3 )`
      )

      expect (
        SELECT.from(Foo).where({1:1}).and({x:1,or:{x:2}}).and({y:2,or:{z:3}})
      ).to.eql (
        CQL`SELECT from Foo where 1=1 and ( x=1 or x=2 ) and ( y=2 or z=3 )`
      )

      expect (
        SELECT.from(Foo).where({x:1,or:{x:2}}).and({y:2,or:{z:3}})
      ).to.eql (
        CQL`SELECT from Foo where ( x=1 or x=2 ) and ( y=2 or z=3 )`
      )
    })

    test('where ({x:[undefined]})', () => {
      expect (
        SELECT.from(Foo).where({x:[undefined]})
      ).to.eql ({ SELECT: {
        from: {ref:['Foo']},
        where: [
          {ref:['x']},
          'in',
          { list: [ {val:undefined} ] }
        ]
      }})
    })

    test('where ( ... cql  |  {x:y} )', () => {
      const args = [`foo`, "'bar'", 3]
      const ID = 11

      // using simple predicate objects
      // (Note: this doesn't support paths in left-hand-sides, nor references in arrays)
      expect(
        SELECT.from(Foo).where({
          ID,
          args,
          and: { x: { like: '%x%' }, or: { y: { '>=': 9 } } },
        })
      ).to.eql({
        SELECT: {
          from: { ref: ['Foo'] },
          where: [
            { ref: ['ID'] },
            '=',
            { val: ID },
            'and',
            { ref: ['args'] },
            'in',
            { list: args.map(val => ({ val })) },
            'and',
            {
              xpr: [
                { ref: ['x'] },
                'like',
                { val: '%x%' },
                'or',
                { ref: ['y'] },
                '>=',
                { val: 9 },
              ]
            },
          ],
        }
      })

      // using CQL fragments -> uses cds.parse.expr
      const is_v2 = !!cds.parse.expr('(1,2)').list
      if (is_v2) expect((cqn = CQL`SELECT from Foo where ID=11 and x in ( foo, 'bar', 3)`)).to.eql({
        SELECT: {
          from: { ref: ['Foo'] },
          where: [
            { ref: ['ID'] },
            '=',
            { val: ID },
            'and',
            { ref: ['x'] },
            'in',
            {list:[
              { ref: ['foo'] },
              { val: 'bar' },
              { val: 3 },
            ]}
          ],
        },
      })
      else expect((cqn = CQL`SELECT from Foo where ID=11 and x in ( foo, 'bar', 3)`)).to.eql({
        SELECT: {
          from: { ref: ['Foo'] },
          where: [
            { ref: ['ID'] },
            '=',
            { val: ID },
            'and',
            { ref: ['x'] },
            'in',
            '(',
            { ref: ['foo'] },
            ',',
            { val: 'bar' },
            ',',
            { val: 3 },
            ')',
          ],
        },
      })

      if (!is_v2) expect(
        SELECT.from(Foo).where(`x=`, 1, `or y.z is null and (a>`, 2, `or b=`, 3, `)`)
      ).to.eql(CQL`SELECT from Foo where x=1 or y.z is null and (a>2 or b=3)`)

      expect(SELECT.from(Foo).where(`x between`, 1, `and`, 9)).to.eql(
        CQL`SELECT from Foo where x between 1 and 9`
      )
    })

    test('w/ sub selects', () => {
      // in where causes
      expect(SELECT.from(Foo).where({ x: SELECT('y').from('Bar') })).to.eql(
        CQL`SELECT from Foo where x in (SELECT y from Bar)`
      )

      // using query api
      expect(SELECT.from('Books').where(
        `author.name in`, SELECT('name').from('Authors'))).to.eql(CQL`SELECT from Books where author.name in (SELECT name from Authors)`
      )

      // in classical semi joins
      expect(
        SELECT('x').from(Foo) .where ( `exists`,
          SELECT(1).from('Bar') .where ({ y: { ref: ['x'] } })
        ) // prettier-ignore
      ).to.eql(CQL`SELECT x from Foo where exists (SELECT 1 from Bar where y=x)`)

      // in select clauses
      cqn = CQL`SELECT from Foo { x, (SELECT y from Bar) as y }`
      cds.version >= '3.33.3' &&
        expect(
          SELECT.from(Foo, (foo) => {
            foo.x, foo(SELECT.from('Bar', (b) => b.y)).as('y')
          })
        ).to.eql(cqn)
      cds.version >= '3.33.3' &&
        expect(
          SELECT.from(Foo, ['x', Object.assign(SELECT('y').from('Bar'), { as: 'y' })])
        ).to.eql(cqn)
    })

    test('w/ plain SQL', () => {
      expect(SELECT.from(Books) + 'WHERE ...').to.eql(
        'SELECT * FROM capire_bookshop_Books WHERE ...'
      )
    })

    it('should consistently handle *', () => {
      expect({
        SELECT: { from: { ref: ['Foo'] }, columns: ['*'] },
      })
      .to.eql(CQL`SELECT * from Foo`)
      .to.eql(CQL`SELECT from Foo{*}`)
      .to.eql(SELECT('*').from(Foo))
      .to.eql(SELECT.from(Foo,['*']))
    })

    it('should consistently handle lists', () => {
      const ID = 11,  args = [{ref:['foo']}, "bar", 3]
      const cqn = CQL`SELECT from Foo where ID=11 and x in (foo,'bar',3)`
      expect(SELECT.from(Foo).where`ID=${ID} and x in ${args}`).to.eql(cqn)
      expect(SELECT.from(Foo).where(`ID=`, ID, `and x in`, args)).to.eql(cqn)
      expect(SELECT.from(Foo).where({ ID, x:args })).to.eql(cqn)
    })

    //
  })

  describe(`SELECT for update`, () => {
    beforeAll(() => {
      delete cds.env.sql.lock_acquire_timeout
    })

    it('no wait', () => {
      const q = SELECT.from('Foo').forUpdate()
      expect(q.SELECT.forUpdate).eqls({})
    })

    it('specific wait', () => {
      const q = SELECT.from('Foo').forUpdate({ wait: 1 })
      expect(q.SELECT.forUpdate).eqls({ wait: 1 })
    })

    it('default wait', () => {
      cds.env.sql.lock_acquire_timeout = 2
      const q = SELECT.from('Foo').forUpdate()
      expect(q.SELECT.forUpdate).eqls({ wait: 2 })
    })

    it('override default', () => {
      cds.env.sql.lock_acquire_timeout = 1
      const q = SELECT.from('Foo').forUpdate({ wait:-1 })
      expect(q.SELECT.forUpdate).eqls({})
    })
  })

  describe(`INSERT...`, () => {
    test('entries ({a,b}, ...)', () => {
      const entries = [{ foo: 1 }, { boo: 2 }]
      expect(INSERT(...entries).into(Foo))
        .to.eql(INSERT(entries).into(Foo))
        .to.eql(INSERT.into(Foo).entries(...entries))
        .to.eql(INSERT.into(Foo).entries(entries))
        .to.eql({
          INSERT: { into: cds.env.ql.quirks_mode ? 'Foo' : { ref: ['Foo'] }, entries },
        })
    })

    test('rows ([1,2], ...)', () => {
      expect(
        INSERT.into(Foo)
          .columns('a', 'b')
          .rows([
            [1, 2],
            [3, 4],
          ])
      )
        .to.eql(INSERT.into(Foo).columns('a', 'b').rows([1, 2], [3, 4]))
        .to.eql({
          INSERT: {
            into: cds.env.ql.quirks_mode ? 'Foo' : { ref: ['Foo'] },
            columns: ['a', 'b'],
            rows: [
              [1, 2],
              [3, 4],
            ],
          },
        })
    })

    test('values (1,2)', () => {
      expect(INSERT.into(Foo).columns('a', 'b').values([1, 2]))
        .to.eql(INSERT.into(Foo).columns('a', 'b').values(1, 2))
        .to.eql({
          INSERT: { into:  cds.env.ql.quirks_mode ? 'Foo' : { ref: ['Foo'] }, columns: ['a', 'b'], values: [1, 2] },
        })
    })

    test('w/ plain SQL', () => {
      expect(INSERT.into(Books) + 'VALUES ...').to.eql(
        'INSERT INTO capire_bookshop_Books VALUES ...'
      )
    })
  })

  describe(`UPDATE...`, () => {
    test('entity (..., <key>)', () => {
      const cqnWhere = {
          UPDATE: {
            entity: cds.env.ql.quirks_mode ? 'capire.bookshop.Books' : { ref: ['capire.bookshop.Books'] },
            where: [{ ref: ['ID'] }, '=', { val: 4711 }],
          },
        }
      expect(UPDATE(Books).where({ ID: 4711 }))
        .to.eql(UPDATE(Books).where(`ID=`, 4711))
        .to.eql(cqnWhere)

      const cqnKey = (cds.version >= '5.6.0') ?
        {
          UPDATE: {
            entity: { ref: [{ id: 'capire.bookshop.Books', where: [{ ref: ['ID'] }, '=', { val: 4711 }] }] }
          }
        }
        : cqnWhere
      expect(UPDATE(Books, 4711))
        .to.eql(UPDATE(Books, { ID: 4711 }))
        .to.eql(UPDATE(Books).byKey(4711))
        .to.eql(UPDATE(Books).byKey({ ID: 4711 }))
        .to.eql(UPDATE.entity(Books, 4711))
        .to.eql(UPDATE.entity(Books, { ID: 4711 }))
        // etc...
        .to.eql(cqnKey)
    })

    /*
    UPDATE.with allows to pass in plain data payloads, e.g. as obtained from REST clients.
    In addition, UPDATE.with supports specifying expressions, either in CQL fragements
    notation or as simple expression objects.

    UPDATE.data allows to pass in plain data payloads, e.g. as obtained from REST clients.
    The passed in object can be modified subsequently, e.g. by adding or modifying values
    before the query is finally executed.
    */
    test('with + data', () => {
      if (cds.version < '4.1.0') return
      const o = {}
      const q = UPDATE(Foo).data(o).with(`bar-=`, 22)
      o.foo = 11
      expect(q)
        .to.eql(UPDATE(Foo).with(`foo=`, 11, `bar-=`, 22))
        .to.eql(UPDATE(Foo).with({ foo: 11, bar: { '-=': 22 } }))
        .to.eql({
          UPDATE: {
            entity: cds.env.ql.quirks_mode ? 'Foo' : { ref: ['Foo'] },
            data: { foo: 11 },
            with: {
              bar: { xpr: [{ ref: ['bar'] }, '-', { val: 22 }] },
            },
          },
        })

      // some more
      expect(UPDATE(Foo).with(`bar = coalesce(x,y), car = 'foo''s bar, car'`)).to.eql({
        UPDATE: {
          entity: cds.env.ql.quirks_mode ? 'Foo' : { ref: ['Foo'] },
          data: {
            car: "foo's bar, car",
          },
          with: {
            bar: { func: 'coalesce', args: [{ ref: ['x'] }, { ref: ['y'] }] },
          },
        },
      })
    })

    test('w/ plain SQL', () => {
      expect(UPDATE(Books) + 'SET ...').to.eql('UPDATE capire_bookshop_Books SET ...')
    })
  })

  describe(`DELETE...`, () => {
    test('from (..., <key>)', () => {
      const cqnWhere = {
          DELETE: {
            from: cds.env.ql.quirks_mode ? 'capire.bookshop.Books' : { ref: ['capire.bookshop.Books'] },
            where: [{ ref: ['ID'] }, '=', { val: 4711 }],
          },
        }
      expect(DELETE.from(Books).where({ ID: 4711 }))
        .to.eql(DELETE.from(Books).where(`ID=`, 4711))
        .to.eql(cqnWhere)
      const cqnKey = (cds.version >= '5.6.0') ?
        {
          DELETE: {
          from: { ref: [{ id: 'capire.bookshop.Books', where: [{ ref: ['ID'] }, '=', { val: 4711 }]}] }
          },
        } : cqnWhere

      expect(DELETE(Books, 4711))
        .to.eql(DELETE(Books, { ID: 4711 }))
        .to.eql(DELETE.from(Books, 4711))
        .to.eql(DELETE.from(Books, { ID: 4711 }))
        .to.eql(DELETE.from(Books).byKey(4711))
        .to.eql(DELETE.from(Books).byKey({ ID: 4711 }))
        .to.eql(cqnKey)
    })

    test('/w plain SQL', () => {
      expect(DELETE.from(Books) + 'WHERE ...').to.eql(
        'DELETE FROM capire_bookshop_Books WHERE ...'
      )
    })
  })

  describe(`cds.ql etc...`, () => {
    it('should keep null and undefined', () => {
      for (let each of [null, undefined]) {
        expect(SELECT.from(Foo).where({ ID: each })).to.eql({
          SELECT: {
            from: { ref: ['Foo'] },
            where: [{ ref: ['ID'] }, '=', { val: each }],
          },
        })
      }
    })
  })

  //
})
