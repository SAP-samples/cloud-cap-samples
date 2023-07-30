const cds = require('@sap/cds')

// FIXME: no longer works like this with new audit logging plugin
module.exports = class MyAuditLogService extends cds.AuditLogService {
  async init() {
    // console.log('My Audit Log');
    // call AuditLogService's init
    await super.init()

    const db = await cds.connect.to('db')
    const { AuditLogStore } = db.entities('sap.capire.auditLog')

    // register custom handlers
    this.on('dataAccessLog', async req => {
      const logs = []

      const action = 'DataAccess'
      const user = req.user.id
      const timestamp = req.timestamp
      const tenant = req.tenant
      const channel = req.channel

      req.data.accesses.forEach(dataAccess => {
        logs.push({
          Action: action,
          User: user,
          Timestamp: timestamp,
          Tenant: tenant,
          Channel: channel,
          DataSubjectType: dataAccess.data_subject.type,
          DataSubjectRole: dataAccess.data_subject.role,
          DataSubjectID: JSON.stringify(dataAccess.data_subject.id),
          ObjectType: dataAccess.object.type,
          ObjectKey: JSON.stringify(dataAccess.object.id),
          Blob: JSON.stringify(dataAccess)
        })
      })

      await INSERT.into(AuditLogStore).entries(logs)
    })

    this.on('dataModificationLog', async req => {
      const mods = []

      const action = 'DataModification'
      const user = req.user.id
      const timestamp = req.timestamp
      const tenant = req.tenant
      const channel = req.channel

      req.data.modifications.forEach(dataModification => {
        mods.push({
          Action: action,
          User: user,
          Timestamp: timestamp,
          Tenant: tenant,
          Channel: channel,
          DataSubjectType: dataModification.data_subject.type,
          DataSubjectRole: dataModification.data_subject.role,
          DataSubjectID: JSON.stringify(dataModification.data_subject.id),
          ObjectType: dataModification.object.type,
          ObjectKey: JSON.stringify(dataModification.object.id),
          Blob: JSON.stringify(dataModification)
        })
      })

      await INSERT.into(AuditLogStore).entries(mods)
    })
  }
}
