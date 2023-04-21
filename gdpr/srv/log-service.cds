using {sap.capire.bookshop as db}   from '../db/data-privacy';
using {sap.capire.orders   as dbo}   from '../db/data-privacy';
using {sap.capire.auditLog as log}  from '../db/AuditLogStore.cds';

//@requires: 'PersonalDataManagerUser' // security check
service LogService {

  entity Customers             as projection on db.Customers;
  entity CustomerPostalAddress as projection on db.CustomerPostalAddress;
  entity Orders                as projection on dbo.Orders;

  entity AuditLogStore         as projection on log.AuditLogStore;
        
};
