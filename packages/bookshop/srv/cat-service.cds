using { sap.capire.bookshop as db } from '../db/schema';


service CatalogService {
  entity Books as projection on db.Books;
}