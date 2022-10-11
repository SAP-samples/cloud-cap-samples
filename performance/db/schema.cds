using { Currency, cuid, managed } from '@sap/cds/common';

namespace sap.capire.performance;


entity OrdersHeaders : managed {
  key ID   : UUID;
  OrderNo  : String @title:'Order Number'; //> readable key 
  buyer    : String;
  currency : Currency;
  Items    : Composition of many OrdersItems on Items.Header = $self;
}

entity OrdersItems   {
    key ID    : UUID;
    product   : Association to Books;
    quantity  : Integer;
    title     : String; //> intentionally replicated as snapshot from product.title
    price     : Double; //> materialized calculated field
    Header    : Association to OrdersHeaders;  
};


entity Books {
  key ID : Integer;
  title  : localized String(111);
  descr  : localized String(1111);
  author : Association to Authors;
  stock  : Integer;
  price  : Decimal;
  currency : Currency;
}

entity Authors  {
  key ID : Integer;
  name   : String(111);
  dateOfBirth  : Date;
  dateOfDeath  : Date;
  placeOfBirth : String;
  placeOfDeath : String;
  books  : Association to many Books on books.author = $self;
}





