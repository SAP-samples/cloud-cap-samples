 using sap.capire.bookstore.CatalogService as CatalogService  from '../srv/services';

 ////////////////////////////////////////////////////////////////////////////
 //
 //	Books Lists
 //
 annotate CatalogService.Books with @(
    UI: {
         HeaderFacets: [
          {$Type: 'UI.ReferenceFacet', Label: 'Description', Target: '@UI.FieldGroup#Descr'},
       ],
       Facets: [
          {$Type: 'UI.ReferenceFacet', Label: 'Details', Target: '@UI.FieldGroup#Price'},
       ],
       FieldGroup#Descr: {
          Data: [
             {Value: descr},
          ]
       },
       FieldGroup#Price: {
          Data: [
             {Value: price},
             {Value: currency.symbol, Label: 'Currency'},
          ]
       },
       Identification: [{Value:title}],
      SelectionFields: [ ID,  price, currency_code ],
       LineItem: [
          {Value: ID},
          {Value: title},
          {Value: author_ID, Label:'Author ID'},
          {Value: stock},
          {Value: price},
          {Value: currency.symbol, Label:''},
       ]
    }

 );

 ////////////////////////////////////////////////////////////////////////////
 //
 //	Books Details
 //
 annotate CatalogService.Books with @(
    UI: {
    HeaderInfo: {
       TypeName: 'Book',
       TypeNamePlural: 'Books',
       Title: {Value: title},

    },
    }
 );

 ////////////////////////////////////////////////////////////////////////////
 //
 //	Books Elements
 //
 annotate CatalogService.Books with {
    ID @title:'ID' @UI.HiddenFilter;
    title @title:'Title';
    author @title:'Author ID';
    price @title:'Price';
    stock @title:'Stock';
    descr @UI.MultiLineText;
 }
