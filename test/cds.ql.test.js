const { expect } = require('./capire')
const cds = require('@sap/cds')
const CQL = ([cql]) => cds.parse.cql(cql)
const Foo = { name: 'Foo' }
const Books = { name: 'capire.bookshop.Books' }

const is_cds_333 = cds.version >= '3.33.3'
if (!is_cds_333) {
  // Monky-patching v3.33.3 features in older releases
  const up = UPDATE('x').constructor.prototype
  up.with = up.set
}

// while jest has 'test' as alias to 'it', mocha doesn't
if (!global.test) global.test = it

describe('cds.ql', () => {
  //

  describe(`BUGS + GAPS...`, () => {
    it.skip('should consistently handle *', () => {
      expect({
        SELECT: { from: { ref: ['Foo'] }, columns: ['*'] },
      })
        .to.eql(CQL`SELECT * from Foo`)
        .to.eql(CQL`SELECT from Foo{*}`)
        .to.eql(SELECT('*').from(Foo))
        .to.eql(SELECT.from(Foo, ['*']))
    })

    it.skip('should correctly handle { ... and:{...} }', () => {
      expect(SELECT.from(Foo).where({ x: 1, and: { y: 2, or: { z: 2 } } })).to.eql({
        SELECT: {
          from: { ref: ['Foo'] },
          where: [
            { ref: ['x'] },
            '=',
            { val: 1 },
            'and',
            '(',
            { ref: ['y'] },
            '=',
            { val: 2 },
            'or',
            { ref: ['z'] },
            '=',
            { val: 3 },
            ')',
          ],
        },
      })
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
      expect(CQL`SELECT * from Foo`).to.eql(CQL`SELECT from Foo{*}`)
      //> .to.eql... FIXME: see skipped 'should handle * correctly' below
      expect(SELECT('*').from(Foo))
        .to.eql(SELECT.from(Foo, ['*']))
        .to.eql(SELECT.from(Foo, (foo) => foo('*')))
        .to.eql(SELECT.from(Foo).columns('*'))
        .to.eql(SELECT.from(Foo).columns((foo) => foo('*')))
        .to.eql({
          SELECT: { from: { ref: ['Foo'] }, columns: [{ ref: ['*'] }] },
        })

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
      expect(CQL`SELECT from Foo {a,b as c}`)
        .to.eql(SELECT.from(Foo, ['a', { b: 'c' }]))
        .to.eql(
          SELECT.from(Foo, (foo) => {
            foo.a, foo.b.as('c')
          })
        )
        .to.eql(SELECT.from(Foo).columns('a', { b: 'c' }))
        .to.eql(SELECT.from(Foo).columns(['a', { b: 'c' }]))
        .to.eql(
          SELECT.from(Foo).columns((foo) => {
            foo.a, foo.b.as('c')
          })
        )
        .to.eql({
          SELECT: {
            from: { ref: ['Foo'] },
            columns: [{ ref: ['a'] }, { ref: ['b'], as: 'c' }],
          },
        })

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

    is_cds_333 &&
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

    is_cds_333 &&
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
      expect(SELECT.distinct.from(Foo).cqn)
        // .to.eql(CQL(`SELECT distinct from Foo`).SELECT)
        .to.eql(SELECT.distinct(Foo).cqn)
        .to.eql({ distinct: true, from: { ref: ['Foo'] } })

      expect(SELECT.one.from(Foo).cqn)
        // .to.eql(CQL(`SELECT one from Foo`).SELECT)
        .to.eql(SELECT.one(Foo).cqn)
        .to.eql({ one: true, from: { ref: ['Foo'] } })

      expect(SELECT.one('a').from(Foo).cqn)
        // .to.eql(CQL(`SELECT distinct a from Foo`).SELECT)
        .to.eql(SELECT.one(['a']).from(Foo).cqn)
        .to.eql(SELECT.one(Foo, ['a']).cqn)
        .to.eql(SELECT.one(Foo, (foo) => foo.a).cqn)
        .to.eql(SELECT.one.from(Foo, (foo) => foo.a).cqn)
        .to.eql(SELECT.one.from(Foo, ['a']).cqn)
        .to.eql({
          one: true,
          from: { ref: ['Foo'] },
          columns: [{ ref: ['a'] }],
        })
      // same for works distinct
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
            '(', //> this one is not required
            { ref: ['ID'] },
            '=',
            { val: ID },
            'and',
            { ref: ['args'] },
            'in',
            { val: args },
            'and',
            // '(',  //> this one is missing, and that's changing the logic -> that's a BUG
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
      expect(CQL`SELECT from Foo where ID=11 and x in ( foo, 'bar', 3)`)
        .to.eql(SELECT.from(Foo).where(`ID=`, ID, `and x in`, args))
        .to.eql(SELECT.from(Foo).where(`ID=${ID} and x in (${args})`))
        .to.eql({
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

      expect(CQL`SELECT from Foo where x=1 or y.z is null and (a>2 or b=3)`).to.eql(
        SELECT.from(Foo).where(`x=`, 1, `or y.z is null and (a>`, 2, `or b=`, 3, `)`)
      )

      expect(CQL`SELECT from Foo where x between 1 and 9`).to.eql(
        SELECT.from(Foo).where(`x between`, 1, `and`, 9)
      )
    })

    test('w/ sub selects', () => {
      // in where causes
      expect(CQL`SELECT from Foo where x in (SELECT y from Bar)`).to.eql(
        SELECT.from(Foo).where({ x: SELECT('y').from('Bar') })
      )
      // in classical semi joins
      expect(CQL`SELECT x from Foo where exists (SELECT 1 from Bar where y=x)`).to.eql(
        SELECT('x').from(Foo) .where ( `exists`,
        SELECT(1).from('Bar') .where ({ y: { ref: ['x'] } })
      ) // prettier-ignore
      )
      // in select clauses
      cds.version >= '3.33.3' &&
        expect(CQL`SELECT from Foo { x, (SELECT y from Bar) as y }`)
          .to.eql(
            SELECT.from(Foo, (foo) => {
              foo.x, foo(SELECT.from('Bar', (b) => b.y)).as('y')
            })
          )
          .to.eql(
            SELECT.from(Foo, ['x', Object.assign(SELECT('y').from('Bar'), { as: 'y' })])
          )
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
  */
    test('with', () => {
      expect(UPDATE(Foo).with(`foo=11, bar = bar - 22`))
        .to.eql(UPDATE(Foo).with(`foo=`, 11, `bar-=`, 22))
        .to.eql(UPDATE(Foo).with({ foo: 11, bar: { '-=': 22 } }))
        .to.eql({
          UPDATE: {
            entity: 'Foo',
            with: {
              foo: { val: 11 },
              bar: { xpr: [{ ref: ['bar'] }, '-', { val: 22 }] },
            },
          },
        })

      // some more
      expect(UPDATE(Foo).with(`bar = coalesce(x,y), car = 'foo''s bar, car'`)).to.eql({
        UPDATE: {
          entity: 'Foo',
          with: {
            bar: { func: 'coalesce', args: [{ ref: ['x'] }, { ref: ['y'] }] },
            car: { val: "foo's bar, car" },
          },
        },
      })
    })

    /*
    UPDATE.data allows to pass in plain data payloads, e.g. as obtained from REST clients.
    The passed in object can be modified subsequently, e.g. by adding or modifying values
    before the query is finally executed.
  */
    test('data', () => {
      const o = {}
      const q = UPDATE(Foo).data(o).with(`bar-=`, 22)
      o.foo = 11
      expect(q).to.eql({
        UPDATE: {
          entity: 'Foo',
          data: { foo: 11 },
          with: {
            bar: { xpr: [{ ref: ['bar'] }, '-', { val: 22 }] },
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
    it('queries marked for cds repl', () => {
      expect(UPDATE(Foo)._isQuery).to.be.true
    })

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
