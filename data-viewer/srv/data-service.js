const cds = require('@sap/cds')
const log = cds.log('data')

class DataService extends cds.ApplicationService { init(){

  this.on ('READ', 'Entities', req => {
    const { dataSource } = req.req.query
    const srvPrefixes = cds.db.model.all('service').map(srv => srv.name+'.')
    const dataSourceFilter = dataSource === 'db'
      ? e => e['@cds.persistence.skip'] !== true // for DB, excl. entities w/o persistence
      : e => !!srvPrefixes.find(srvName => e.name.startsWith(srvName)) // only entities reachable from a service

    return cds.db.model.all('entity')
      .filter (e => req.data && req.data.name ? e.name === req.data.name : true)  // honor name filter from request, if any
      .filter (e => !e.name.startsWith('DRAFT.'))  // exclude synthetic stuff
      .filter (e => !e.name.startsWith('DataService.'))  // exclude this service
      .filter (dataSourceFilter)
      .sort((e1, e2) => e1.name.localeCompare(e2.name))
      .map(e => {
        const columns = Object.entries(e.elements)
          .filter(([_, el]) => !(el instanceof cds.Association)) // exclude assocs+compositions
          .map(([name, el]) => { return { name, type: el.type, isKey:!!el.key }})
        return { name: e.name, columns }
      })
    })

  this.on ('READ', 'Data', async req => {
    const { entity: entityName, dataSource: dataSourceName } = req.req.query
    if (!entityName)  return req.reject(400, `Must provide 'entity' query`)
    const entity = cds.db.model.definitions[entityName]
    if (!entity)  return req.reject(404, 'No such entity: ' + entityName)

    const query = SELECT.from(entity)
    query.SELECT.limit = req.query.SELECT.limit  // forward $skip / $top

    const dataSource = findDataSource(dataSourceName, entityName)
    const res = await dataSource.run(query)
    return res.map((line) => {
      const record = Object.entries(line).map(([column, data]) => ({ column, data }))
      return {
        record,
        ID: cds.utils.uuid() // just to be OData-compliant
      }
    })
  })

  return super.init()
}}

module.exports = { DataService }

function findDataSource(dataSourceName, entityName) {
  for (let srv of Object.values(cds.services)) { // all connected services
    if (!srv.name)  continue // FIXME intermediate/pending in cds.services ?
    if (dataSourceName === srv.name || entityName.startsWith(srv.name+'.')) {
      log._debug && log.debug(`using ${srv.name} as data source`)
      return srv
    }
  }
  return cds.services.db // fallback
}
