const cds = require ('@sap/cds')
const {resolve} = require ('path')
const {promisify} = require('util')
const readFile = promisify(require('fs').readFile)
const swaggerUi = require ('swagger-ui-express')
const DEBUG = cds.debug('openapi')

let app, host, docCache={}

cds
  .on ('bootstrap', _app => { app = _app })
  .on ('serving', service => {
    const apiPath = '/api-docs'+service.path
    console.log (`[Open API] - serving ${service.name} at ${apiPath}`)
    app.use(apiPath, async (req, _, next) => {
      req.swaggerDoc = await toOpenApiDoc(service, host, docCache)
      next()
    }, swaggerUi.serve, swaggerUi.setup())
    addLink(service, apiPath)
  })
  .on ('listening', ({server})=> { host = 'localhost:'+server.address().port })

async function toOpenApiDoc(service, host, cache) {
  if (!cache[service.name]) {
    const spec = await openApiFromFile(service, host)
    if (spec) {
      cache[service.name] = spec
    }
    else if (cds.compile.to.openapi) {  // on-the-fly exporter available?
      DEBUG && DEBUG ('Compiling Open API spec for', service.name)
      cache[service.name] = cds.compile.to.openapi (service.model, {
        service: service.name,
        'openapi:url': service.path
      })
    }
  }
  return cache[service.name]
}

async function openApiFromFile(service) {
  const fileName = resolve(`srv/${service.name}.openapi3.json`)
  const file = await readFile(fileName).catch(()=>{/*no such file*/})
  if (file) {
    DEBUG && DEBUG ('Using Open API spec from file', fileName)
    return JSON.parse(file)
  }
}

function addLink(service, apiPath) {
  const link = (entity) => {
    if (entity)  return // don't want to provide link on entity level
    return { href:apiPath, name:'Swagger UI', title:'Show in Swagger UI' }
  }
  service.$linkProviders ? service.$linkProviders.push(link) : service.$linkProviders = [link]
}

module.exports = cds.server
