using { sap.capire.bookshop as my } from '../db/schema';
service AdminService @(requires_:'admin') {
  entity Books as projection on my.Books;
  entity Authors as projection on my.Authors;
  @readonly entity Cafeterias as projection on my.Cafeterias;
  entity Employee as projection on my.Employee;
  entity Meal as projection on my.Meal;
}
