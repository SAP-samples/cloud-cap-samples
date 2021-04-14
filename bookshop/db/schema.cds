using { Currency, managed, sap } from '@sap/cds/common';
namespace sap.capire.bookshop;

entity Books {
  key ID : Integer;
  title  : localized String(111);
  author : Association to Authors;
  genre  : Association to Genres;
}

entity Authors {
  key ID : Integer;
  name   : String(111);
  books  : Association to many Books on books.author = $self;
}

entity Genres : sap.common.CodeList {
  key ID   : Integer;
  parent   : Association to Genres;
  children : Composition of many Genres on children.parent = $self;
}
