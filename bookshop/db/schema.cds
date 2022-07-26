using { Currency, managed, sap, extensible } from '@sap/cds/common';
namespace sap.capire.bookshop;

@Extensibility.Any.Enabled : true
entity Books : managed, extensible {
  key ID : Integer;
  title  : localized String(111);
  descr  : localized String(1111);
  author : Association to Authors;
  genre  : Association to Genres;
  stock  : Integer;
  price  : Decimal;
  currency : Currency;
  image : LargeBinary @Core.MediaType : 'image/png';
  authorName: String;
}

@Extensibility : {
  Fields.Enabled      : true,
  Relations.Enabled   : false,
  Annotations.Enabled : true,
  Logic.Enabled : true,
  Logic.constraints: true,
  Logic.calculations: true,
  Logic.Handler : [create, update, delete, read]
}
entity Authors : managed, extensible {
  key ID : Integer;
  name   : String(111);
  dateOfBirth  : Date;
  dateOfDeath  : Date;
  placeOfBirth : String;
  placeOfDeath : String;
  virtual age: Integer;
  books  : Association to many Books on books.author = $self;
}

/** Hierarchically organized Code List for Genres */
entity Genres : sap.common.CodeList {
  key ID   : Integer;
  parent   : Association to Genres;
  children : Composition of many Genres on children.parent = $self;
}
