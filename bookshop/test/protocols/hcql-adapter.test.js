const cds = require('@sap/cds/lib')
const { GET, expect, axios } = cds.test(__dirname)

// Fetch API disallows GET|HEAD requests with body
if (axios.constructor.name === 'Naxios') it = it.skip

describe ('GET w/ query in body', () => {

  it ('serves CQN query objects in body', async () => {
    const {data:books} = await GET ('/hcql/admin', {
      headers: { 'Content-Type': 'application/json' },
      data: cds.ql `SELECT from Books`
    })
    expect(books).to.be.an('array').of.length(5)
  })

  it ('serves plain CQL strings in body', async () => {
    const {data:books} = await GET ('/hcql/admin', {
      headers: { 'Content-Type': 'text/plain' },
      data: `SELECT from Books`
    })
    expect(books).to.be.an('array').of.length(5)
  })

  it ('serves complex and deep queries', async () => {
    const {data:books} = await GET ('/hcql/admin', {
      headers: { 'Content-Type': 'text/plain' },
      data: `SELECT from Authors {
        name,
        books [order by title] {
          title,
          genre.name as genre
        }
      }`
    })
    expect(books).to.deep.equal([
      {
        name: "Emily Brontë",
        books: [
          { title: "Wuthering Heights", genre: 'Drama' }
        ]
      },
      {
        name: "Charlotte Brontë",
        books: [
          { title: "Jane Eyre", genre: 'Drama' }
        ]
      },
      {
        name: "Edgar Allen Poe",
        books: [
          { title: "Eleonora", genre: 'Romance' },
          { title: "The Raven", genre: 'Mystery' },
        ]
      },
      {
        name: "Richard Carpenter",
        books: [
          { title: "Catweazle", genre: 'Fantasy' }
        ]
      }
    ])
  })

})


describe ('Sluggified variants', () => {

  test ('GET /Books', async () => {
    const {data:books} = await GET ('/hcql/admin/Books')
    expect(books).to.be.an('array').of.length(5)
    expect(books.length).to.eql(5) //.of.length(5)
  })


  test ('GET /Books/201', async () => {
    const {data:book} = await GET ('/hcql/admin/Books/201')
    expect(book).to.be.an('object')
    expect(book).to.have.property ('title', "Wuthering Heights")
  })

  test ('GET /Books { title, author.name as author }' , async () => {
    const {data:books} = await GET ('/hcql/admin/Books { title, author.name as author } order by ID')
    expect(books).to.deep.equal ([
      { title: "Wuthering Heights", author: "Emily Brontë" },
      { title: "Jane Eyre", author: "Charlotte Brontë" },
      { title: "The Raven", author: "Edgar Allen Poe" },
      { title: "Eleonora", author: "Edgar Allen Poe" },
      { title: "Catweazle", author: "Richard Carpenter" }
    ])
  })

  test ('GET /Books/201 w/ CQL tail in URL' , async () => {
    const {data:book} = await GET ('/hcql/admin/Books/201 { title, author.name as author } order by ID')
    expect(book).to.deep.equal ({ title: "Wuthering Heights", author: "Emily Brontë" })
  })

  it ('GET /Books/201 w/ CQL fragment in body' , async () => {
    const {data:book} = await GET ('/hcql/admin/Books/201', {
      headers: { 'Content-Type': 'text/plain' },
      data: `{ title, author.name as author }`
    })
    expect(book).to.deep.equal ({ title: "Wuthering Heights", author: "Emily Brontë" })
  })

  it ('GET /Books/201 w/ CQN fragment in body' , async () => {
    const {data:book} = await GET ('/hcql/admin/Books/201', {
      data: cds.ql `SELECT title, author.name as author` .SELECT
    })
    expect(book).to.deep.equal ({ title: "Wuthering Heights", author: "Emily Brontë" })
  })

  it ('GET /Books/201 w/ tail in URL plus CQL/CQN fragments in body' , async () => {
    const {data:[b1]} = await GET ('/hcql/admin/Books where ID=201', {
      data: cds.ql `SELECT title, author.name as author` .SELECT
    })
    expect(b1).to.deep.equal ({ title: "Wuthering Heights", author: "Emily Brontë" })
    const {data:[b2]} = await GET ('/hcql/admin/Books where ID=201', {
      headers: { 'Content-Type': 'text/plain' },
      data: `{ title, author.name as author }`
    })
    expect(b2).to.deep.equal ({ title: "Wuthering Heights", author: "Emily Brontë" })
  })

})