using { Currency, managed, sap } from '@sap/cds/common';
namespace sap.capire.bookshop;

entity Books : managed {
  key ID : Integer;
  title  : localized String(111);
  descr  : localized String(1111);
  author : Association to Authors;
  genre  : Association to Genres;
  stock  : Integer;
  price  : Decimal(9,2);
  currency : Currency;
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

/** Hierarchically organized Code List for Genres */
entity Genres : sap.common.CodeList {
  key ID   : Integer;
  parent   : Association to Genres;
  children : Composition of many Genres on children.parent = $self;
}

entity Employee {
	key iNumber : String;
	name  : String;
	email  : String;
	contact : String;
	building : String;
	labsCampus : String;
}

entity Cafeterias {
	key ID : String;
	name : String;
	labsCampus	: String;
	capacity : Integer;
  meal : Association to Meal;
}

entity Meal {
	key ID : String;
	type : String;
	vendorID : String;
	cuisine : String;
	description : String;
	calories : Decimal(10,2);
	image : LargeBinary;
  cafes: Association to many Cafeterias on cafes.meal = $self;
}
