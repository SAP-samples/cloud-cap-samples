describe('@capire/bookshop', () => {
  const { GET, POST, expect } = require('@capire/tests').launch('@capire/bookshop')

  it('should serve $metadata documents in v4', async () => {
    const { headers, status, data } = await GET`/browse/$metadata`
    expect(headers).to.contain({
      'content-type': 'application/xml',
      'odata-version': '4.0',
    })
    expect(data).to.contain(
      '<EntitySet Name="Books" EntityType="CatalogService.Books">'
    )
    expect(data).to.contain(
      '<Annotation Term="Common.Label" String="Currency"/>'
    )
    expect(status).to.equal(200)
  })

  it('should serve localized $metadata documents', async () => {
    const { data } = await GET`/browse/$metadata?sap-language=de`
    expect(data).to.contain(
      '<Annotation Term="Common.Label" String="Währung"/>'
    )
  })

  it('should serve localized Books with $expanded currency', async () => {
    const {
      data,
    } = await GET`/browse/Books?&$select=title,author&$expand=currency&sap-language=de`
    expect(data.value).to.containSubset([
      {
        ID: 201,
        title: 'Sturmhöhe',
        author: 'Emily Brontë',
        currency: {
          code: 'GBP',
          descr: 'Britische Pfund',
          name: 'Pfund',
          symbol: '£',
        },
      },
      {
        ID: 207,
        title: 'Jane Eyre',
        author: 'Charlotte Brontë',
        currency: {
          descr: 'Britische Pfund',
        },
      },
      {
        ID: 251,
        title: 'The Raven',
        author: 'Edgar Allen Poe',
        currency: {
          code: 'USD',
          name: 'US-Dollar',
          symbol: '$',
        },
      },
      {
        ID: 252,
        title: 'Eleonora',
        author: 'Edgar Allen Poe',
      },
      {
        ID: 271,
        title: 'Catweazle',
        author: 'Richard Carpenter',
        currency: {
          code: 'EUR',
          name: 'Euro',
          symbol: '€',
        },
      },
    ])
  })

  it('should serve localized Authors w/ $expanded book and currency', async () => {
    const { data } = await GET(
      `/admin/Authors/101?sap-language=de` +
        `&$expand=books($select=title;$expand=currency($select=code,name,symbol))` +
        `&$select=name`
    )
    expect(data).to.eql({
      '@odata.context':
        '$metadata#Authors(name,ID,books(title,ID,currency(code,name,symbol)))/$entity',
      ID: 101,
      name: 'Emily Brontë',
      books: [
        {
          ID: 201,
          title: 'Sturmhöhe',
          currency: {
            code: 'GBP',
            name: 'Pfund',
            symbol: '£',
          },
        },
      ],
    })
  })

  it('should check on current stocks with $value', async () => {
    const { data } = await GET`/admin/Books/201/stock/$value`
    expect(data).to.equal(12)
  })

  it('should reject out-of-stock orders', () => {
    return expect(
      Promise.all([
        POST('/browse/submitOrder', { book: 201, amount: 5 }),
        POST('/browse/submitOrder', { book: 201, amount: 5 }),
        POST('/browse/submitOrder', { book: 201, amount: 5 }),
      ])
    ).to.be.rejectedWith(/409 - 5 exceeds stock for book #201/)
  })

  it('should serve $select requests', async () => {
    const { data } = await GET`/browse/Books?$select=ID,title`
    expect(data.value).to.eql([
      { ID: 201, title: 'Wuthering Heights' },
      { ID: 207, title: 'Jane Eyre' },
      { ID: 251, title: 'The Raven' },
      { ID: 252, title: 'Eleonora' },
      { ID: 271, title: 'Catweazle' },
    ])
  })

  it('should serve $search requests', async () => {
    const { data } = await GET`/admin/Authors?$search=Bro&$select=name`
    expect(data.value).to.eql([
      { ID: 101, name: 'Emily Brontë' },
      { ID: 107, name: 'Charlotte Brontë' },
    ])
  })

  it('should serve $expand requests', async () => {
    const {
      data,
    } = await GET`/admin/Authors?$select=name&$expand=books($select=ID,title)`
    expect(data.value).to.eql([
      {
        ID: 101,
        name: 'Emily Brontë',
        books: [{ ID: 201, title: 'Wuthering Heights' }],
      },
      {
        ID: 107,
        name: 'Charlotte Brontë',
        books: [{ ID: 207, title: 'Jane Eyre' }],
      },
      {
        ID: 150,
        name: 'Edgar Allen Poe',
        books: [
          { ID: 251, title: 'The Raven' },
          { ID: 252, title: 'Eleonora' },
        ],
      },
      {
        ID: 170,
        name: 'Richard Carpenter',
        books: [{ ID: 271, title: 'Catweazle' }],
      },
    ])
  })
})
