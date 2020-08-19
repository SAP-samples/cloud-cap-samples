const cds = require ('./cds')
const { GET, expect } = cds.test ('serve', __dirname+'/localized-data.cds', '--in-memory')

describe('Localized Data', () => {

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
          { title: 'Eleonora',  currency: { name: 'US-Dollar', symbol: '$' } },
        ],
      },
    ])
  })

  xit('supports @cds.localized:false', async ()=>{
    const { data } = await GET(`/browse/BooksSans?&$select=title,localized_title&$expand=currency&$filter=locale eq 'de' or locale eq null`, {
      headers: { 'Accept-Language': 'de' },
    })
    expect(data.value).to.containSubset([
      { title: 'Wuthering Heights', localized_title: 'Sturmhöhe', currency: { name: 'British Pound' } },
      { title: 'Jane Eyre', currency: { name: 'British Pound' } },
      { title: 'The Raven', currency: { name: 'US Dollar' } },
      { title: 'Eleonora',  currency: { name: 'US Dollar' } },
      { title: 'Catweazle', currency: { name: 'Euro' } },
    ])
  })
})
