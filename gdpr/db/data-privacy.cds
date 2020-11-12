// Proxy for importing schema from bookshop sample
using { sap.capire.bookshop } from './schema';

// annotations for Data Privacy
annotate bookshop.Customers with @PersonalData.EntitySemantics: 'DataSubject' 
  {
    ID           @PersonalData.FieldSemantics: 'DataSubjectID';
    emailAddress @PersonalData.IsPotentiallyPersonal;
    firstName    @PersonalData.IsPotentiallyPersonal;
    lastName     @PersonalData.IsPotentiallyPersonal;
    creditCardNo @PersonalData.IsPotentiallySensitive;
  }

annotate bookshop.CustomerPostalAddress with @PersonalData.EntitySemantics: 'DataSubjectDetails' 
  {
    Customer  @PersonalData.FieldSemantics: 'DataSubjectID';
    street    @PersonalData.IsPotentiallyPersonal;
    town      @PersonalData.IsPotentiallyPersonal;
    country   @PersonalData.IsPotentiallyPersonal;
  }

// annotations for Personal Data Manager - Search Fields
annotate bookshop.Customers with @(Communication.Contact  : {
    n : {
        surname: lastName,
        given:   firstName
    },
    email: emailAddress
}); 

// annotations for Audit Log
annotate bookshop.Customers with @AuditLog.Operation: {Read: true, Insert: true, Update: true, Delete: true};

annotate bookshop.CustomerPostalAddress with @AuditLog.Operation: {Read: true, Insert: true, Update: true, Delete: true};
