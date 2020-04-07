using { sap.capire.bookshop as db } from '../db/schema';

service CatalogService {
  entity Books as projection on db.Books;

  entity BooksInfo (RATING : Integer) as select from db.BooksInfo(REQ_RATING: :RATING) {*};

  entity BooksDescr as select from db.BooksDescr;
}