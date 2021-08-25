const { expect } = require('../test')
const cds = require('@sap/cds/lib')
const CQL = ([cql]) => cds.parse.cql(cql)
const Foo = { name: 'Foo' }
const Books = { name: 'capire.bookshop.Books' }

const { cdr } = cds.ql

// while jest has 'test' as alias to 'it', mocha doesn't
if (!global.test) global.test = it

describe('cds.ql → cqn', () => {
  //
  let cqn

  describe.skip(`BUGS + GAPS...`, () => {

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
      const ID = 11,  args = [`foo`, "'bar'", 3]
      const cqn = CQL`SELECT from Foo where ID=11 and x in (foo,'bar',3)`
      expect(SELECT.from(Foo).where(`ID=${ID} and x in (${args})`)).to.eql(cqn)
      expect(SELECT.from(Foo).where(`ID=`, ID, `and x in`, args)).to.eql(cqn)
      expect(SELECT.from(Foo).where({ ID, x:args })).to.eql(cqn)
    })

  })


  describe(`SELECT...`, () => {
    test('from ( Foo )', () => {
      expect({
        SELECT: { from: { ref: ['Foo'] } },
      })
      .to.eql(CQL`SELECT from Foo`)
      .to.eql(SELECT.from(Foo))
    })

    test('from ( ..., <key>)', () => {
      // Compiler
      expect(CQL`SELECT from Foo[11]`).to.eql({
        SELECT: {
          // REVISIT: add one:true?
          from: { ref: [{ id: 'Foo', where: [{ val: 11 }] }] },
        },
      })

      expect(CQL`SELECT from Foo[ID=11]`).to.eql({
        SELECT: {
          // REVISIT: add one:true
          from: {
            ref: [{ id: 'Foo', where: [{ ref: ['ID'] }, '=', { val: 11 }] }],
          },
        },
      })

      // Runtime ds.ql
      expect(SELECT.from(Foo, 11))
        .to.eql(SELECT.from(Foo, { ID: 11 }))
        .to.eql(SELECT.from(Foo).byKey(11))
        .to.eql(SELECT.from(Foo).byKey({ ID: 11 }))
        .to.eql(SELECT.one.from(Foo).where({ ID: 11 }))
        .to.eql({
          // REVISIT: should produce CQN as the ones above?
          SELECT: {
            one: true,
            from: { ref: ['Foo'] },
            where: [{ ref: ['ID'] }, '=', { val: 11 }],
          },
        })

      expect(CQL`SELECT from Foo[11]{a}`).to.eql({
        SELECT: {
          // REVISIT: add one:true?
          from: { ref: [{ id: 'Foo', where: [{ val: 11 }] }] },
          columns: [{ ref: ['a'] }],
        },
      })

      expect(SELECT.from(Foo, 11, ['a']))
        .to.eql(SELECT.from(Foo, 11, (foo) => foo.a))
        .to.eql({
          // REVISIT: should produce CQN as the ones above?
          SELECT: {
            one: true,
            from: { ref: ['Foo'] },
            columns: [{ ref: ['a'] }],
            where: [{ ref: ['ID'] }, '=', { val: 11 }],
          },
        })
    })

    test('from ( ..., => {...})', () => {
      // single *, prefix and postfix, as array and function
      let parsed, fluid
      expect((parsed = CQL`SELECT * from Foo`)).to.eql(CQL`SELECT from Foo{*}`)
      //> .to.eql... FIXME: see skipped 'should handle * correctly' below
      expect((fluid = SELECT('*').from(Foo)))
        .to.eql(SELECT.from(Foo, ['*']))
        .to.eql(SELECT.from(Foo, (foo) => foo('*')))
        .to.eql(SELECT.from(Foo).columns('*'))
        .to.eql(SELECT.from(Foo).columns((foo) => foo('*')))
        .to.eql({
          SELECT: { from: { ref: ['Foo'] }, columns: [{ ref: ['*'] }] },
        })

      if (cdr) expect(parsed).to.eql(fluid)

      // single column, prefix and postfix, as array and function
      expect(CQL`SELECT a from Foo`)
      expect(CQL`SELECT from Foo {a}`)
        .to.eql(SELECT.from(Foo, ['a']))
        .to.eql(SELECT.from(Foo, (foo) => foo.a))
        .to.eql({
          SELECT: { from: { ref: ['Foo'] }, columns: [{ ref: ['a'] }] },
        })

      // multiple columns, prefix and postfix, as array and function
      expect(CQL`SELECT a,b as c from Foo`)

      expect (CQL`SELECT from Foo {a,b as c}`).to.eql(cqn = {
        SELECT: {
          from: { ref: ['Foo'] },
          columns: [{ ref: ['a'] }, { ref: ['b'], as: 'c' }],
        },
      })
      expect(SELECT.from(Foo, ['a', { b: 'c' }])).to.eql(cqn)
      expect(
        SELECT.from(Foo, (foo) => {
          foo.a, foo.b.as('c')
        })
      ).to.eql(cqn)
      expect(SELECT.from(Foo).columns('a', { b: 'c' })).to.eql(cqn)
      expect(SELECT.from(Foo).columns(['a', { b: 'c' }])).to.eql(cqn)
      expect(
        SELECT.from(Foo).columns((foo) => {
          foo.a, foo.b.as('c')
        })
      ).to.eql(cqn)

      // multiple columns and *, prefix and postfix, as array and function
      expect(CQL`SELECT *,a,b from Foo`).to.eql(CQL`SELECT from Foo{*,a,b}`)
      //> .to.eql... FIXME: see skipped 'should handle * correctly' below
      expect(SELECT.from(Foo, ['a', 'b', '*']))
      .to.eql(SELECT.from(Foo).columns('a', 'b', '*'))
      .to.eql(SELECT.from(Foo).columns(['a', 'b', '*']))
      .to.eql(
        SELECT.from(Foo, (foo) => {
          foo.a, foo.b, foo('*')
        })
      )
      .to.eql({
        SELECT: {
          from: { ref: ['Foo'] },
          columns: [{ ref: ['a'] }, { ref: ['b'] }, { ref: ['*'] }],
        },
      })
    })

    test('from ( ..., => _.expand ( x=>{...}))', () => {
      // SELECT from Foo { *, x, bar.*, car{*}, boo { *, moo.zoo } }
      expect(
        SELECT.from(Foo, (foo) => {
          foo('*'),
            foo.x,
            foo.car('*'),
            foo.boo((b) => {
              b('*'), b.moo.zoo((x) => x.y.z)
            })
        })
      ).to.eql({
        SELECT: {
          from: { ref: ['Foo'] },
          columns: [
            { ref: ['*'] },
            { ref: ['x'] },
            { ref: ['car'], expand: ['*'] },
            {
              ref: ['boo'],
              expand: ['*', { ref: ['moo', 'zoo'], expand: [{ ref: ['y', 'z'] }] }],
            },
          ],
        },
      })
    })

    test('from ( ..., => _.inline ( _=>{...}))', () => {
      // SELECT from Foo { *, x, bar.*, car{*}, boo { *, moo.zoo } }
      expect(
        SELECT.from(Foo, (foo) => {
          foo.bar('*'),
            foo.bar('.*'), //> leading dot indicates inline
            foo.boo((x) => x.moo.zoo),
            foo.boo((_) => _.moo.zoo) //> underscore arg name indicates inline
        })
      ).to.eql({
        SELECT: {
          from: { ref: ['Foo'] },
          columns: [
            { ref: ['bar'], expand: ['*'] },
            { ref: ['bar'], inline: ['*'] },
            { ref: ['boo'], expand: [{ ref: ['moo', 'zoo'] }] },
            { ref: ['boo'], inline: [{ ref: ['moo', 'zoo'] }] },
          ],
        },
      })
    })

    test('one / distinct ...', () => {
      expect(SELECT.distinct.from(Foo).SELECT)
        // .to.eql(CQL(`SELECT distinct from Foo`).SELECT)
        .to.eql(SELECT.distinct(Foo).SELECT)
        .to.eql({ distinct: true, from: { ref: ['Foo'] } })

      expect(SELECT.one.from(Foo).SELECT)
        // .to.eql(CQL(`SELECT one from Foo`).SELECT)
        .to.eql(SELECT.one(Foo).SELECT)
        .to.eql({ one: true, from: { ref: ['Foo'] } })

      expect(SELECT.one('a').from(Foo).SELECT)
        // .to.eql(CQL(`SELECT distinct a from Foo`).SELECT)
        .to.eql(SELECT.one(['a']).from(Foo).SELECT)
        .to.eql(SELECT.one(Foo, ['a']).SELECT)
        .to.eql(SELECT.one(Foo, (foo) => foo.a).SELECT)
        .to.eql(SELECT.one.from(Foo, (foo) => foo.a).SELECT)
        .to.eql(SELECT.one.from(Foo, ['a']).SELECT)
        .to.eql({
          one: true,
          from: { ref: ['Foo'] },
          columns: [{ ref: ['a'] }],
        })
      // same for works distinct
    })

    it('should correctly handle { ... and:{...} }', () => {
      expect(SELECT.from(Foo).where({ x: 1, and: { y: 2, or: { z: 3 } } })).to.eql({
        SELECT: {
          from: { ref: ['Foo'] },
          where: cdr ? [
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
          ] : [
            { ref: ['x'] },
            '=',
            { val: 1 },
            'and',
            '(',
            // {xpr:[
              { ref: ['y'] },
              '=',
              { val: 2 },
              'or',
              { ref: ['z'] },
              '=',
              { val: 3 },
            // ]},
            ')',
          ],
        },
      })
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
          where: cdr
            ? [
                { ref: ['ID'] },
                '=',
                { val: ID },
                'and',
                { ref: ['args'] },
                'in',
                { list: args.map(val => ({ val })) },
                'and',
                {xpr:[
                  { ref: ['x'] },
                  'like',
                  { val: '%x%' },
                  'or',
                  { ref: ['y'] },
                  '>=',
                  { val: 9 },
                ]},
              ]
            : [
                { ref: ['ID'] },
                '=',
                { val: ID },
                'and',
                { ref: ['args'] },
                'in',
                { val: args },
                'and',
                '(',
                  { ref: ['x'] },
                  'like',
                  { val: '%x%' },
                  'or',
                  { ref: ['y'] },
                  '>=',
                  { val: 9 },
                ')',
              ],
        },
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

    it('w/ plain SQL', () => {
      expect(SELECT.from(Books) + 'WHERE ...').to.eql(
        'SELECT * FROM capire_bookshop_Books WHERE ...'
      )
    })

    //
  })

  describe(`INSERT...`, () => {
    test('entries ({a,b}, ...)', () => {
      const entries = [{ foo: 1 }, { boo: 2 }]
      expect(INSERT(...entries).into(Foo))
        .to.eql(INSERT(entries).into(Foo))
        .to.eql(INSERT.into(Foo).entries(...entries))
        .to.eql(INSERT.into(Foo).entries(entries))
        .to.eql({
          INSERT: { into: 'Foo', entries },
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
            into: 'Foo',
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
          INSERT: { into: 'Foo', columns: ['a', 'b'], values: [1, 2] },
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
      expect(UPDATE(Books, 4711))
        .to.eql(UPDATE(Books, { ID: 4711 }))
        .to.eql(UPDATE(Books).byKey(4711))
        .to.eql(UPDATE(Books).byKey({ ID: 4711 }))
        .to.eql(UPDATE(Books).where({ ID: 4711 }))
        .to.eql(UPDATE(Books).where(`ID=`, 4711))
        .to.eql(UPDATE.entity(Books, 4711))
        .to.eql(UPDATE.entity(Books, { ID: 4711 }))
        // etc...
        .to.eql({
          UPDATE: {
            entity: 'capire.bookshop.Books',
            where: [{ ref: ['ID'] }, '=', { val: 4711 }],
          },
        })
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
            entity: 'Foo',
            data: { foo: 11 },
            with: {
              bar: { xpr: [{ ref: ['bar'] }, '-', { val: 22 }] },
            },
          },
        })

      // some more
      expect(UPDATE(Foo).with(`bar = coalesce(x,y), car = 'foo''s bar, car'`)).to.eql({
        UPDATE: {
          entity: 'Foo',
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
      expect(DELETE(Books, 4711))
        .to.eql(DELETE(Books, { ID: 4711 }))
        .to.eql(DELETE.from(Books, 4711))
        .to.eql(DELETE.from(Books, { ID: 4711 }))
        .to.eql(DELETE.from(Books).byKey(4711))
        .to.eql(DELETE.from(Books).byKey({ ID: 4711 }))
        .to.eql(DELETE.from(Books).where({ ID: 4711 }))
        .to.eql(DELETE.from(Books).where(`ID=`, 4711))
        .to.eql({
          DELETE: {
            from: 'capire.bookshop.Books',
            where: [{ ref: ['ID'] }, '=', { val: 4711 }],
          },
        })
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
