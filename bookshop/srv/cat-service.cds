using { sap.capire.bookshop as my } from '../db/schema';
service CatalogService @(path:'/browse') {

  @readonly entity Books as SELECT from my.Books {*,
    author.name as author
  } excluding { createdBy, modifiedBy };

  @requires_: 'authenticated-user'
  action submitOrder (book : Books.ID, amount: Integer);


  @readonly entity Cafeterias as SELECT from my.Cafeterias {*,
    meal.description as meal
    };
}
