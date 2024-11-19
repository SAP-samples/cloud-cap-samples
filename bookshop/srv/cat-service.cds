using { sap.capire.bookshop as my } from '../db/schema';
service CatalogService @(path:'/browse') {

  /** For displaying lists of Books */
  @readonly entity Books as projection on Book excluding { descr };

  /** For display in details pages */
  @readonly entity Book as projection on my.Books { *,
    currency.name as currencyName, // flattened
    currency.symbol as currency,  // flattened
    author.name as author,       // flattened
    genre.name as genre,        // flattened
  } excluding {
    createdBy, modifiedBy, // as end users shouldn't see them
    localized, texts,     // as end users don't need them
  };

  @requires: 'authenticated-user'
  action submitOrder ( book: Book:ID, quantity: Integer ) returns { stock: Integer };
  event OrderedBook : { book: Book:ID; quantity: Integer; buyer: String };
}
