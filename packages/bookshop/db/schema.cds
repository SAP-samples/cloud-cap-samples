namespace sap.capire.bookshop;
using { Currency, managed, cuid } from '@sap/cds/common';

entity Books : managed {
  key ID : UUID;
  title  : localized String(111);
  descr  : localized String(1111);
  author : Association to Authors;
  stock  : Integer;
  price  : Decimal(9,2);
  currency : Currency;
  texts: Composition of many Books_texts on texts.ID = ID;
  localized: Association to Books_texts on localized.ID = $self.ID and localized.locale = $user.locale;
}

entity Books_texts {
    key texts_id: UUID;
    ID: UUID;
    locale : String(5);
    title : String(111);
    descr : String(1111);
    book : Association to Books on book.ID = ID;
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

entity Orders : cuid, managed {
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many OrderItems on Items.parent = $self;
  total    : Decimal(9,2) @readonly;
  currency : Currency;
}
entity OrderItems : cuid {
  parent    : Association to Orders;
  book      : Association to Books;
  amount    : Integer;
  netAmount : Decimal(9,2);
}
