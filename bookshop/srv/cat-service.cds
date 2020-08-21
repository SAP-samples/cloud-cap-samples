using { sap.capire.bookshop as my } from '../db/schema';
service CatalogService @(path:'/browse') {

  @readonly entity Books as SELECT from my.Books {*,
    author.name as author
  } excluding { createdBy, modifiedBy };

  @requires_: 'authenticated-user'
  action submitOrder (book : Books.ID, amount: Integer);

  type BusinessContext: {
     ProjectionID: String;
     ProjectionDescription: String;
     BusinessContext: String;
     BusinessContextDescription: String;
  }

  function getReferenceObject (selectedAttribute: String) returns array of BusinessContext;

  action activateExtension (extend : String, name : String, type : String);
}
