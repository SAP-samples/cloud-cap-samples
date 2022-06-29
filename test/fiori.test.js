const cds = require('@sap/cds/lib')
const { GET, expect, axios } = cds.test ('@capire/fiori', '--with-mocks')
axios.defaults.auth = { username: 'alice', password: 'admin' }

// TODO enable if proxy-adapter 1.9 is out w/ support for ephemeral ports for testing
describe.skip('cap/samples - Fiori APIs', () => {

  it('serves $metadata documents in v2', async () => {
    const { headers, data } = await GET `/v2/browse/$metadata`
    expect(headers).to.contain({
      'content-type': 'application/xml',
      'dataserviceversion': '2.0',
    })
    expect(data).to.contain('<EntitySet Name="GenreHierarchy" EntityType="CatalogService.GenreHierarchy"/>')
  })


})
