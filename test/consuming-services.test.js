const cds = require('./cds')
const { expect } = cds.test (
  'serve', 'AdminService', '--from', '@capire/bookshop,@capire/common', '--in-memory'
).in(__dirname)

describe('Consuming Services locally', () => {
  //
  it('bootrapped the database successfully', ()=>{
    const { AdminService } = cds.services
    const { Authors } = AdminService.entities
    expect(AdminService).not.to.be.undefined
    expect(Authors).not.to.be.undefined
  })

  it('supports targets as strings or reflected defs', async () => {
    const AdminService = await cds.connect.to('AdminService')
    const { Authors } = AdminService.entities
    expect(await AdminService.read(Authors))
      .to.eql(await AdminService.read('Authors'))
      .to.eql(await AdminService.run(SELECT.from(Authors)))
    // temporary workaround
    if (AdminService.read.fix_50)
      expect(await AdminService.run(SELECT.from(Authors))).to.eql(
        await AdminService.run(SELECT.from('Authors'))
      )
  })

  it('allows reading from local services using cds.ql', async () => {
    const AdminService = await cds.connect.to('AdminService')
    const query = SELECT.from('Authors', (a) => {
      a.name,
        a.books((b) => {
          b.title,
            b.currency((c) => {
              c.name, c.symbol
            })
        })
    }).where(`name like`, 'E%')
    // temporary workaround
    if (!AdminService.read.fix_50) {
      query.SELECT.from.ref[0] = 'AdminService.Authors'
    }
    const authors = await AdminService.run(query)
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
    expect(await cds.run(query1))
      .to.eql(await db.run(query1))
      .to.eql(await srv.run(query1))
      .to.eql(await srv.read(Authors, projection).where(`name like`, 'E%'))
    const query2 = cds.read(Authors, projection).where(`name like`, 'E%')
    // temporary workaround
    if (srv.read.fix_50)
      expect(await cds.run(query1))
        .to.eql(await cds.run(query2))
        .to.eql(await db.run(query2))
        .to.eql(await srv.run(query2))
        .to.eql(await db.read(Authors, projection).where(`name like`, 'E%')) // FIXME!!
  })
})
