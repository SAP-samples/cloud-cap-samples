namespace sap.capire.bookstore;

// We reuse Products, which are Books in our domain
using { sap.capire.products.Products as Books } from '@sap/capire-products';
using { Currency, managed } from '@sap/cds/common';

extend Books with {
  author : Association to Authors;
}

entity Authors : managed {
  key ID : Integer;
  name   : String(111);
  dateOfBirth  : Date;
  dateOfDeath  : Date;
  placeOfBirth : String;
  placeOfDeath : String;
  books  : Association to many Books on books.author = $self;
}

entity Orders : managed {
  key ID : Integer;
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many OrderItems on Items.parent = $self;
  total    : Decimal(9,2) @readonly;
  currency : Currency;
}

entity OrderItems {
  key ID : Integer;
  parent    : Association to Orders;
  book      : Association to Books;
  amount    : Integer;
  netAmount : Decimal(9,2);
}