describe('Localized Data', () => {
  const { GET, expect } = require('./capire').launch('bookshop')

  it('serves localized $metadata documents', async () => {
    const { data } = await GET`/browse/$metadata?sap-language=de`
    expect(data).to.contain('<Annotation Term="Common.Label" String="Währung"/>')
  })

  it('supports sap-language param', async () => {
    const { data } = await GET(`/browse/Books?$select=title,author` + '&sap-language=de')
    expect(data.value).to.containSubset([
      { title: 'Sturmhöhe', author: 'Emily Brontë' },
      { title: 'Jane Eyre', author: 'Charlotte Brontë' },
      { title: 'The Raven', author: 'Edgar Allen Poe' },
      { title: 'Eleonora', author: 'Edgar Allen Poe' },
      { title: 'Catweazle', author: 'Richard Carpenter' },
    ])
  })

  it('supports accept-language header', async () => {
    const { data } = await GET(`/browse/Books?$select=title,author`, {
      headers: { 'Accept-Language': 'de' },
    })
    expect(data.value).to.containSubset([
      { title: 'Sturmhöhe', author: 'Emily Brontë' },
      { title: 'Jane Eyre', author: 'Charlotte Brontë' },
      { title: 'The Raven', author: 'Edgar Allen Poe' },
      { title: 'Eleonora', author: 'Edgar Allen Poe' },
      { title: 'Catweazle', author: 'Richard Carpenter' },
    ])
  })

  it('supports queries with $expand', async () => {
    const { data } = await GET(`/browse/Books?&$select=title,author&$expand=currency`, {
      headers: { 'Accept-Language': 'de' },
    })
    expect(data.value).to.containSubset([
      { title: 'Sturmhöhe', author: 'Emily Brontë', currency: { name: 'Pfund' } },
      { title: 'Jane Eyre', author: 'Charlotte Brontë', currency: { name: 'Pfund' } },
      { title: 'The Raven', author: 'Edgar Allen Poe', currency: { name: 'US-Dollar' } },
      { title: 'Eleonora', author: 'Edgar Allen Poe', currency: { name: 'US-Dollar' } },
      { title: 'Catweazle', author: 'Richard Carpenter', currency: { name: 'Euro' } },
    ])
  })

  it('supports queries with nested $expand', async () => {
    const { data } = await GET(`/admin/Authors`, {
      params: {
        $filter: `startswith(name,'E')`,
        $expand: `books(
          $select=title;
          $expand=currency(
            $select=name,symbol
          )
        )`.replace(/\s/g, ''),
        $select: `name`,
      },
      headers: { 'Accept-Language': 'de' },
    })
    expect(data.value).to.containSubset([
      {
        name: 'Emily Brontë',
        books: [{ title: 'Sturmhöhe', currency: { name: 'Pfund', symbol: '£' } }],
      },
      {
        name: 'Edgar Allen Poe',
        books: [
          { title: 'The Raven', currency: { name: 'US-Dollar', symbol: '$' } },
          { title: 'Eleonora', currency: { name: 'US-Dollar', symbol: '$' } },
        ],
      },
    ])
  })
})
