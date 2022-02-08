using {sap.capire.orders} from '@capire/orders';
using {sap.capire.gdpr} from './schema';

/*
 * annotations for Data Privacy (Personal Data Manager and Audit Logging)
 */
annotate gdpr.Customers with @PersonalData  : {
  DataSubjectRole : 'Customer',
  EntitySemantics : 'DataSubject'
}{
  ID           @PersonalData.FieldSemantics : 'DataSubjectID';
  email        @PersonalData.IsPotentiallyPersonal;
  firstName    @PersonalData.IsPotentiallyPersonal;
  lastName     @PersonalData.IsPotentiallyPersonal;
  creditCardNo @PersonalData.IsPotentiallySensitive;
  dateOfBirth  @PersonalData.IsPotentiallyPersonal;
}

annotate gdpr.CustomerPostalAddresses with @PersonalData : {
  DataSubjectRole : 'Customer',
  EntitySemantics : 'DataSubjectDetails'
}{
  customer @PersonalData.FieldSemantics                  : 'DataSubjectID';
  street   @PersonalData.IsPotentiallyPersonal;
  town     @PersonalData.IsPotentiallyPersonal;
  country  @PersonalData.IsPotentiallyPersonal;
}

/*
 * TODO: Personal Data Manager doesn't know EntitySemantics: 'Other' and FieldSemantics: 'ContractRelatedID'
 *       see: https://help.sap.com/viewer/620a3ea6aaf64610accdd05cca9e3de2/Cloud/en-US/5a55fae1eb7c496c92c56071186d76b3.html
 */
annotate orders.Orders with @PersonalData : {
  DataSubjectRole : 'Customer',
  EntitySemantics : 'LegalGround'
}{
  ID       @PersonalData.FieldSemantics   : 'LegalGroundID';
  customer @PersonalData.FieldSemantics   : 'DataSubjectID';
}

/*
 * additional annotations for Audit Logging
 */
annotate gdpr.Customers with @AuditLog.Operation : {
  Read   : true,
  Insert : true,
  Update : true,
  Delete : true
};

annotate gdpr.CustomerPostalAddresses with @AuditLog.Operation : {
  Read   : true,
  Insert : true,
  Update : true,
  Delete : true
};
