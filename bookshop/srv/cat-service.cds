using { sap.capire.bookshop as my } from '../db/schema';
service CatalogService @(path:'/browse') {

  @readonly entity Books as SELECT from my.Books { *,
    author.name as author
  } excluding { createdBy, modifiedBy };

  @readonly entity ListOfBooks as SELECT from Books
  excluding { descr };

  @requires: 'authenticated-user'
  action submitOrder ( book: Books:ID, amount: Integer ) returns { stock: Integer };
  event OrderedBook : { book: Books:ID; amount: Integer; buyer: String };
}
