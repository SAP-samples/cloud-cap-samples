using { sap.capire.bookshop.Genres } from '@capire/bookstore';

annotate Genres with @cds.search: {name};
annotate Genres with @readonly;
annotate Genres with {
  name @title: '{i18n>Genre}';
}

// Lists
annotate Genres with @(
  Common.SemanticKey : [name],
  UI.SelectionFields : [name],
  UI.LineItem : [
   { Value: name, Label: '{i18n>Name}' },
  ],
);

// Details
annotate Genres with @(UI : {
  Identification : [{ Value: name }],
  HeaderInfo     : {
    TypeName       : '{i18n>Genre}',
    TypeNamePlural : '{i18n>Genres}',
    Title          : { Value: name },
    Description    : { Value: ID }
  }
});


// Tree Views
annotate AdminService.Genres with @hierarchy;
// using from './tree-view';
using from './value-help';
