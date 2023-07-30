using {
  managed,
  cuid,
  sap.common.CodeList
} from '@sap/cds/common';

namespace sap.capire.auditLog;

entity AuditLogStore : cuid {

  Action          : String enum {
    DataAccess;
    DataModification
  };

  User            : String;
  Timestamp       : Timestamp;
  Tenant          : String;
  Channel         : String;
  DataSubjectType : String; // Bussiness Partner
  DataSubjectRole : String; // Customer // Employee // ...
  DataSubjectID   : LargeString; // key value pair as JSON
  ObjectType      : String; // like SalesOrder
  ObjectKey       : LargeString; // key value pair as JSON

  Blob            : LargeString; // Payload: DataModification or Data Access as BLOB

}
