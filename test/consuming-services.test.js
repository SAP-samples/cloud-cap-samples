const cds = require('@sap/cds')

describe('cap/samples - Consuming Services locally', () => {

  const { expect } = cds.test ('@capire/bookshop')

  it('bootstrapped the database successfully', ()=>{
    const { AdminService } = cds.services
    const { Authors } = AdminService.entities
    expect(AdminService).to.exist
    expect(Authors).to.exist
  })

  it('supports targets as strings or reflected defs', async () => {
    const AdminService = await cds.connect.to('AdminService')
    const { Authors } = AdminService.entities
    expect (await SELECT.from(Authors))
    // .to.eql(await SELECT.from('Authors'))
    .to.eql(await AdminService.read(Authors))
    .to.eql(await AdminService.read('Authors'))
    .to.eql(await AdminService.run(SELECT.from(Authors)))
    .to.eql(await AdminService.run(SELECT.from('Authors')))
  })

  it('allows reading from local services using cds.ql', async () => {
    const AdminService = await cds.connect.to('AdminService')
    const authors = await AdminService.read (`Authors`, a => {
      a.name,
        a.books((b) => {
          b.title,
            b.currency((c) => {
              c.name, c.symbol
            })
        })
    }).where(`name like`, 'E%')
    if (require('semver').gte(cds.version, '5.9.0')) {
      expect(authors).to.containSubset([
        {
          name: 'Emily Brontë',
          books: [
            {
              title: 'Wuthering Heights',
              currency: { name: 'British Pound', symbol: '£' },
            },
          ],
        },
        {
          name: 'Edgar Allen Poe',
          books: [
            { title: 'The Raven', currency: { name: 'US Dollar', symbol: '$' } },
            { title: 'Eleonora', currency: { name: 'US Dollar', symbol: '$' } },
          ],
        },
      ])
      return
    }
    expect(authors).to.containSubset([
      {
        name: 'Emily Brontë',
        books: [
          {
            ID: 201,
            title: 'Wuthering Heights',
            currency: { name: 'British Pound', symbol: '£' },
          },
        ],
      },
      {
        name: 'Edgar Allen Poe',
        books: [
          { ID: 251, title: 'The Raven', currency: { name: 'US Dollar', symbol: '$' } },
          { ID: 252, title: 'Eleonora', currency: { name: 'US Dollar', symbol: '$' } },
        ],
      },
    ])
  })

  it('provides CRUD-style convenience methods', async () => {})

  it('uses same methods for all kind of services, including dbs', async () => {
    const srv = await cds.connect.to('AdminService')
    const db = await cds.connect.to('db')
    const { Authors } = srv.entities
    const projection = (a) => {
      a.name,
        a.books((b) => {
          b.title,
            b.currency((c) => {
              c.name, c.symbol
            })
        })
    }
    const query1 = SELECT.from(Authors, projection).where(`name like`, 'E%')
    const query2 = cds.read(Authors, projection).where(`name like`, 'E%')
    expect(await cds.run(query1))
    .to.eql(await db.run(query1))
    .to.eql(await srv.run(query1))
    .to.eql(await srv.read(Authors, projection).where(`name like`, 'E%'))
    .to.eql(await cds.run(query2))
    .to.eql(await db.run(query2))
    .to.eql(await srv.run(query2))
    .to.eql(await db.read(Authors, projection).where(`name like`, 'E%'))
  })
})
