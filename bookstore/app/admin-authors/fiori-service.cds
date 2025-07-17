using {AdminService} from '@capire/bookshop';

annotate AdminService.Authors with @odata.draft.enabled;

////////////////////////////////////////////////////////////////////////////
//
//	Authors Object Page
//
annotate AdminService.Authors with @(UI : {
  HeaderInfo : {
    TypeName : 'Author',
    TypeNamePlural : 'Authors',
    Description : {Value : lifetime}
  },
  Facets : [
    {
      $Type : 'UI.ReferenceFacet',
      Label : '{i18n>Details}',
      Target : '@UI.FieldGroup#Details'
    },
    {
      $Type : 'UI.ReferenceFacet',
      Label : '{i18n>Books}',
      Target : 'books/@UI.LineItem'
    },
  ],
  FieldGroup #Details : {Data : [
    {Value : placeOfBirth},
    {Value : placeOfDeath},
    {Value : dateOfBirth},
    {Value : dateOfDeath},
    {
      Value : age,
      Label : '{i18n>Age}'
    },
  ]},
});


// Workaround to avoid errors for unknown db-specific calculated fields above
extend sap.capire.bookshop.Authors with {
  virtual age      : Integer;
  virtual lifetime : String;
}

annotate AdminService.Authors with {
  age      @Common.Label : '{i18n>Age}';
  lifetime @Common.Label : '{i18n>Lifetime}'
}

// Workaround for Fiori popup for asking user to enter a new UUID on Create
annotate AdminService.Authors with { ID @Core.Computed; }
