// Quick hack: suppress deprecation warnings w/ Node22 caused by http-proxy (used by OData v2 proxy)
// See also: https://github.com/http-party/node-http-proxy/pull/1666
require('util')._extend = Object.assign

const cds = require('@sap/cds')

describe('cap/samples - Fiori APIs - v2', function() {

  const { GET, expect, axios } = cds.test ('@capire/fiori', '--with-mocks')
  axios.defaults.auth = { username: 'alice', password: 'admin' }

  // if (this.timeout) this.timeout(1e6)

  it('serves $metadata documents in v2', async () => {
    const { headers, data } = await GET `/odata/v2/browse/$metadata`
    expect(headers).to.contain({
      'content-type': 'application/xml',
      'dataserviceversion': '2.0',
    })
    expect(data).to.contain('<EntitySet Name="GenreHierarchy" EntityType="CatalogService.GenreHierarchy"/>')
  })

  it('serves Books in v2', async () => {
    const { data } = await GET `/odata/v2/browse/Books`
    expect(data).to.containSubset({d:{results:[]}})
    expect(data.d.results.length).to.be.greaterThanOrEqual(5)
  })

})
