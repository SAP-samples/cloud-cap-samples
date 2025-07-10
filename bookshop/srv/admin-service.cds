using { sap.capire.bookshop as my } from '../db/schema';
service AdminService @(path:'/admin') {
  entity Authors as projection on my.Authors;
  entity Books as projection on my.Books;
  entity Genres as projection on my.Genres;
  entity Contents as projection on my.Contents;
}
