import cds from '@sap/cds'
export class OrdService extends cds.ApplicationService {
  init(){

    this.on('READ','documents', req => {
      let csn = cds.context?.model || cds.model
      return { ord: csn }
    })

    /**
     * Just an example to do something with id, if given.
     * Try it out with URLs like that:
     * http://localhost:4004/ord/v1/documents
     * http://localhost:4004/ord/v1/documents/CatalogService
     * http://localhost:4004/ord/v1/documents/CatalogService.Books
     * http://localhost:4004/ord/v1/documents/CatalogService.Authors
     */
    this.on('READ','csn', req => {
      let csn = cds.context?.model || cds.model
      let { id } = req.data
      if (id) csn = csn.definitions[id] || 'not in model!'
      return { id, csn }
    })

    /**
     * Just an example to serve arbitrary content with a function.
     * Try it out with URLs like that:
     * http://localhost:4004/ord/v1/api?service=CatalogService
     * http://localhost:4004/ord/v1/api?service=CatalogService&format=edmx
     * http://localhost:4004/ord/v1/api?service=CatalogService&format=edmx-v2
     * http://localhost:4004/ord/v1/api?service=CatalogService&format=openapi
     */
    this.on('api', req => {
      let csn = cds.context?.model || cds.model
      let { service, format } = req.data
      let { res } = req.http
      if (!format) {
        if (!service) return res.send(csn)
        service = csn.services[service]
        return res.send({ definitions: [ service, ...service.entities ] .reduce ((all,e) => {
          let d = all[e.name] = {...e}
          delete d.projection // not part of the API
          delete d.query     // not part of the API
          return all
        },{})})
      }
      let api = cds.compile(csn).to[format]({service})
      return res.send(api)
    })

    return super.init()
  }
}
