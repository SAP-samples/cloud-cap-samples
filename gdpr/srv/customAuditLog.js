const cds = require('@sap/cds')

module.exports = class MyAuditLogService extends cds.AuditLogService {
  async init() {
    
    // console.log('My Audit Log');
    // call AuditLogService's init
    await super.init()

    const db = await cds.connect.to('db')
    const { AuditLogStore } = db.entities('sap.capire.auditLog')

    // register custom handlers
    this.on('dataAccessLog', async req => {
   
    const logs = [];

    const action    = 'DataAccess';
    const user      = req.user.id;
    const timestamp = req.timestamp;
    const tenant    = req.tenant;
    const channel   = req.channel;
   
    req.data.accesses.forEach( dataAccess => {
      logs.push({
          Action:          action,
          User:            user,
          Timestamp:       timestamp,
          Tenant:          tenant,
          Channel:         channel,
          DataSubjectType: dataAccess.dataSubject.type,
          DataSubjectRole: dataAccess.dataSubject.role,
          DataSubjectID:   JSON.stringify(dataAccess.dataSubject.id),
          ObjectType:      dataAccess.dataObject.type,
          ObjectKey:       JSON.stringify(dataAccess.dataObject.id),
          Blob: JSON.stringify(dataAccess)   
      })  }
    )
   

    await INSERT.into(AuditLogStore).entries(logs)
    }
    )

    this.on('dataModificationLog', async req => {

      const mods = [];

      const action    = 'DataModification';
      const user      = req.user.id;
      const timestamp = req.timestamp;
      const tenant    = req.tenant;
      const channel   = req.channel;

      req.data.modifications.forEach( dataModification => {
        mods.push({
            Action:          action,
            User:            user,
            Timestamp:       timestamp,
            Tenant:          tenant,
            Channel:         channel,
            DataSubjectType: dataModification.dataSubject.type,
            DataSubjectRole: dataModification.dataSubject.role,
            DataSubjectID:   JSON.stringify(dataModification.dataSubject.id),
            ObjectType:      dataModification.dataObject.type,
            ObjectKey:       JSON.stringify(dataModification.dataObject.id),
            Blob: JSON.stringify(dataModification)   
        })  }
      )
    
      

      await INSERT.into(AuditLogStore).entries(mods)
      }
      )
    }
  
  


    


    }

/*
service AuditLogService {

    // SEC-254: Log read access to sensitive personal data
    event dataAccessLog {
      accesses         : array of Access;
    };
  
    // SEC-265: Log changes to personal data
    event dataModificationLog : {
      c : array of DataModification;
    };
}
*/


/*
define type KeyValuePair {
  keyName : String;
  value   : String;
};

define type DataObject {
  type : String;
  id   : array of KeyValuePair;
};

define type DataSubject {
  type : String;
  id   : array of KeyValuePair;
  role : String;
};

define type Attribute {
  name : String;
};


define type Access {
  dataObject  : DataObject;
  dataSubject : DataSubject;
  attributes  : array of Attribute;
  attachments : array of Attachment;
};

define type ChangedAttribute {
  name     : String;
  oldValue : String;
  newValue : String;
};

define type DataModification {
  dataObject  : DataObject;
  dataSubject : DataSubject;
  action      : String @assert.range enum { Create; Update; Delete; };
  attributes  : array of ChangedAttribute;
}
*/