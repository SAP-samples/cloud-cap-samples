const cds = require('@sap/cds')

// redeploy the db incl. initial data for demo purposes
cds.on('bootstrap', app => {
  app.post('/redeploy', async (req, res) => {
    await cds.deploy('*')
    res.status(204).end()
  })
})

// fix cds.context not being set correctly in GraphQL adapter
cds.on('serving', srv => {
  const { dispatch } = srv
  srv.dispatch = function(req) {
    if (!(cds.context instanceof cds.Request)) cds.context = this
    return dispatch.call(this, req)
  }
})

module.exports = cds.server
