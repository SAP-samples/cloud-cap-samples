using { sap.capire.bookshop as my } from '../db/schema';

service AdminService @(_requires:'authenticated-user') {
  entity Books as projection on my.Books;
  entity Authors as projection on my.Authors;
  entity Orders as select from my.Orders;
}
