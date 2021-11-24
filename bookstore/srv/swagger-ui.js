
// -----------------------------------------------------------------------
// Adding Swagger UI - see https://cap.cloud.sap/docs/advanced/openapi
const cds = require ('@sap/cds')
try {
  const cds_swagger = require ('cds-swagger-ui-express')
  cds.once ('bootstrap', app => app.use (cds_swagger()) )
} catch (err) {
  if (err.code !== 'MODULE_NOT_FOUND')  throw err
}
