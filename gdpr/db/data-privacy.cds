// Proxy for importing schema from bookshop sample
using {sap.capire.bookshop} from './schema';

// annotations for Data Privacy
annotate bookshop.Customers with @PersonalData: {
  DataSubjectRole: 'Customer',
  EntitySemantics: 'DataSubject'
} {
  ID          @PersonalData.FieldSemantics    : 'DataSubjectID';
  email       @PersonalData.IsPotentiallyPersonal;
  firstName   @PersonalData.IsPotentiallyPersonal;
  lastName    @PersonalData.IsPotentiallyPersonal;
  dateOfBirth @PersonalData.IsPotentiallyPersonal;
}

annotate bookshop.BillingData with @PersonalData: {
  DataSubjectRole: 'Customer',
  EntitySemantics: 'DataSubjectDetails'
} {
  customer     @PersonalData.FieldSemantics     : 'DataSubjectID';
  creditCardNo @PersonalData.IsPotentiallySensitive;
}

annotate bookshop.Addresses with @PersonalData: {
  DataSubjectRole: 'Customer',
  EntitySemantics: 'DataSubjectDetails'
} {
  customer @PersonalData.FieldSemantics       : 'DataSubjectID';
  street   @PersonalData.IsPotentiallyPersonal;
  town     @PersonalData.IsPotentiallyPersonal;
  country  @PersonalData.IsPotentiallyPersonal;
}

annotate bookshop.Orders with @PersonalData.EntitySemantics: 'Other' {
  ID              @PersonalData.FieldSemantics             : 'ContractRelatedID';
  customer        @PersonalData.FieldSemantics             : 'DataSubjectID';
  personalComment @PersonalData.IsPotentiallyPersonal;
}
