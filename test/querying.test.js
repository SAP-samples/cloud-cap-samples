describe('Querying', () => {
  const { GET, expect } = require('./capire').launch('bookshop')
  const Authors = {name:'sap.capire.bookshop.Authors'}

  it('should SELECT from Authors', async () => {
    const authors = await SELECT.from (Authors, a => {
      a.name
    })
    expect(authors).to.eql([
      { name: 'Emily Brontë' },
      { name: 'Charlotte Brontë' },
      { name: 'Edgar Allen Poe' },
      { name: 'Richard Carpenter' },
    ])
  })

  it('should SELECT name from Authors', async () => {
    const authors = await SELECT.from (Authors, a => {
      a.name
    })
    expect(authors).to.eql([
      { name: 'Emily Brontë' },
      { name: 'Charlotte Brontë' },
      { name: 'Edgar Allen Poe' },
      { name: 'Richard Carpenter' },
    ])
  })

  it('should GET /Authors?$select=name&$expand=books($select=title)', async () => {
    const {data:{value:authors}} = await GET ('/admin/Authors?$select=name&$expand=books($select=title)')
    expect(authors).to.containSubset([
      { name: 'Emily Brontë', books: [{ title: 'Wuthering Heights' }] },
      { name: 'Charlotte Brontë', books: [{ title: 'Jane Eyre' }] },
      { name: 'Edgar Allen Poe', books: [{ title: 'The Raven' }, { title: 'Eleonora' }] },
      { name: 'Richard Carpenter', books: [{ title: 'Catweazle' }] },
    ])
  })

  it('should SELECT from Authors { name, books { title } }', async () => {
    const authors = await SELECT.from(Authors, a => { a.name, a.books(b=>{ b.title }) })
    expect(authors).to.eql([
      { name: 'Emily Brontë', books: [{ title: 'Wuthering Heights' }] },
      { name: 'Charlotte Brontë', books: [{ title: 'Jane Eyre' }] },
      { name: 'Edgar Allen Poe', books: [{ title: 'The Raven' }, { title: 'Eleonora' }] },
      { name: 'Richard Carpenter', books: [{ title: 'Catweazle' }] },
    ])
  })

  it('should GET /Authors?$expand=books', async () => {
    const {data:{value:authors}} = await GET ('/admin/Authors?$select=name&$expand=books($select=title)')
    expect(authors).to.containSubset([
      { name: 'Emily Brontë', books: [{ title: 'Wuthering Heights' }] },
      { name: 'Charlotte Brontë', books: [{ title: 'Jane Eyre' }] },
      { name: 'Edgar Allen Poe', books: [{ title: 'The Raven' }, { title: 'Eleonora' }] },
      { name: 'Richard Carpenter', books: [{ title: 'Catweazle' }] },
    ])
  })

  it('should SELECT from Authors { *, books{*} }', async () => {
    const authors = await SELECT.from(Authors, a => { a('*'), a.books(b => b('*')) })
    // const authors = await SELECT.from(Authors, ['*',{ref:['books'], expand:['*']}])
    // const authors = await SELECT.from(Authors, [{ref:['*']},{ref:['books'], expand:[{ref:['*']}]}])
    expect(authors).to.eql([
      { name: 'Emily Brontë', books: [{ title: 'Wuthering Heights' }] },
      { name: 'Charlotte Brontë', books: [{ title: 'Jane Eyre' }] },
      { name: 'Edgar Allen Poe', books: [{ title: 'The Raven' }, { title: 'Eleonora' }] },
      { name: 'Richard Carpenter', books: [{ title: 'Catweazle' }] },
    ])
  })

})
