const {resolve} = require ('path')
const {promisify} = require('util')
const readFile = promisify(require('fs').readFile)
const swaggerUi = require ('swagger-ui-express')
const cds = require ('@sap/cds')
const trace = cds.debug('openapi')
const cors = require('cors')

let app, docCache={}

cds
  .on ('bootstrap', _app => {
    app = _app
    app.use(cors())  // allow to be called from e.g. editor.swagger.io
  })
  .on ('serving', service => {
    const apiPath = '/api-docs'+service.path
    console.log (`[Open API] - serving ${service.name} at ${apiPath}`)
    app.use(apiPath, async (req, _, next) => {
      req.swaggerDoc = await toOpenApiDoc(service, docCache)
      next()
    }, swaggerUi.serve, swaggerUi.setup())
    addLinkToIndexHtml(service, apiPath)
  })

async function toOpenApiDoc(service, cache) {
  if (!cache[service.name]) {
    const spec = await openApiFromFile(service)
    if (spec) {  // pre-compiled spec file available?
      cache[service.name] = spec
    }
    else if (cds.compile.to.openapi) {  // on-the-fly exporter available?
      trace && trace ('Compiling Open API spec for', service.name)
      cache[service.name] = cds.compile.to.openapi (service.model, {
        service: service.name,
        'openapi:url': service.path,
        'openapi:diagram': true
      })
    }
  }
  return cache[service.name]
}

async function openApiFromFile(service) {
  const fileName = resolve(`srv/${service.name}.openapi3.json`)
  const file = await readFile(fileName).catch(()=>{/*no such file*/})
  if (file) {
    trace && trace ('Using Open API spec from file', fileName)
    return JSON.parse(file)
  }
}

function addLinkToIndexHtml(service, apiPath) {
  const provider = (entity) => {
    if (entity)  return // avoid link on entity level, looks too messy
    return { href:apiPath, name:'Swagger UI', title:'Show in Swagger UI' }
  }
  service.$linkProviders ? service.$linkProviders.push(provider) : service.$linkProviders = [provider]
}

module.exports = cds.server
