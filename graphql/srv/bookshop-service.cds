using {
  sap.capire.bookshop,
  sap.capire.graphql
} from '../db/schema';

service BookshopService {
  entity Books    as projection on bookshop.Books;
  entity Authors  as projection on bookshop.Authors;
  entity Chapters as projection on graphql.Chapters;
  entity Orders   as projection on graphql.Orders;
}
