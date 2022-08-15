const cds = require('@sap/cds/lib')

describe('cap/samples - Fiori APIs - v2', () => {

  const { GET, expect, axios } = cds.test ('@capire/fiori', '--with-mocks')
  axios.defaults.auth = { username: 'alice', password: 'admin' }

  it('serves $metadata documents in v2', async () => {
    const { headers, data } = await GET `/v2/browse/$metadata`
    expect(headers).to.contain({
      'content-type': 'application/xml',
      'dataserviceversion': '2.0',
    })
    expect(data).to.contain('<EntitySet Name="GenreHierarchy" EntityType="CatalogService.GenreHierarchy"/>')
  })

  it('serves Books in v2', async () => {
    const { data } = await GET `/v2/browse/Books`
    expect(data).to.containSubset({d:{results:[]}})
    expect(data.d.results.length).to.be.greaterThanOrEqual(5)
  })

})
