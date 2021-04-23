
const cds = require('@sap/cds')

describe('Bookshop: OData Protocol Level Testing', () => {
  jest.setTimeout(20*1000)
  const app = require('express')()
  const request = require('supertest')(app)

  beforeAll(async () => {
    await cds.deploy(__dirname + '/../srv/cat-service').to('sqlite::memory:')
    await cds.serve('CatalogService').from(__dirname + '/../srv/cat-service').in(app)
  })

  it('Service $metadata document', async () => {
    const response = await request
      .get('/browse/$metadata')
      .expect('Content-Type', /^application\/xml/)
      .expect(200)

    const expectedVersion = '<edmx:Edmx Version="4.0" xmlns:edmx="http://docs.oasis-open.org/odata/ns/edmx">'
    const expectedBooksEntitySet = '<EntitySet Name="Books" EntityType="CatalogService.Books">'
    expect(response.text.includes(expectedVersion)).toBeTruthy()
    expect(response.text.includes(expectedBooksEntitySet)).toBeTruthy()
  })


  it('Get with select, expand and localized', async () => {
    const response = await request
      .get('/browse/Books?$select=title,author&$expand=currency&sap-language=de')
      .expect('Content-Type', /^application\/json/)
      .expect(200)

    expect(response.body.value).toEqual([
      {
        ID: 201, title: "Sturmhöhe", author: "Emily Brontë",
        currency: { name: "Pfund", descr: "Britische Pfund", code: "GBP", symbol: "£" }
      },
      {
        ID: 207, title: "Jane Eyre", author: "Charlotte Brontë",
        currency: { name: "Pfund", descr: "Britische Pfund", code: "GBP", symbol: "£" }
      },
      {
        ID: 251, title: "The Raven", author: "Edgar Allen Poe",
        currency: { name: "US-Dollar", descr: "United States Dollar", code: "USD", symbol: "$" }
      },
      {
        ID: 252, title: "Eleonora", author: "Edgar Allen Poe",
        currency: { name: "US-Dollar", descr: "United States Dollar", code: "USD", symbol: "$" }
      },
      {
        ID: 271, title: "Catweazle", author: "Richard Carpenter",
        currency: { name: "Euro", descr: "European Euro", code: "EUR", symbol: "€" }
      }
    ])
  })
})

describe('Bookshop: CDS Service Level Testing', () => {
  let srv, Books

  beforeAll(async () => {
    srv = await cds.serve('CatalogService').from(__dirname + '/../srv/cat-service')
    Books = srv.entities.Books
    expect(Books).toBeDefined()
  })

  it('GETs all books', async () => {
    const books = await srv.read(Books, b => { b.title })

    expect(books).toMatchObject([
      { title: 'Wuthering Heights' },
      { title: 'Jane Eyre' },
      { title: 'The Raven' },
      { title: 'Eleonora' },
      { title: 'Catweazle' }
    ])
  })
})