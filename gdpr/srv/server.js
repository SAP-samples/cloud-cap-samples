const cds = require('@sap/cds')

/*
 * in development, write audit logs to custom sink (i.e., to console in this example)
 */
cds.on('served', async () => {
  if (process.env.NODE_ENV === 'production') return

  const auditLogService = await cds.connect.to('audit-log')
  // use prepend to get called before the generic implementation
  auditLogService.prepend(function() {
    const LOG = cds.log('my custom audit logging impl')
    // triggered when reading sensitive personal data
    this.on('dataAccessLog', function(req) {
      const { accesses } = req.data
      for (const access of accesses) LOG.info(access)
    })
    // triggered when modifying personal data
    this.on('dataModificationLog', function(req) {
      const { modifications } = req.data
      for (const modification of modifications) LOG.info(modification)
    })
  })
})

module.exports = cds.server
