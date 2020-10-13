// Proxy for importing schema from bookshop sample
using from '@capire/bookshop';
using { Currency, managed, cuid } from '@sap/cds/common';

namespace sap.capire.bookshop;

entity Orders : managed {
  key ID   : cds.UUID;
  OrderNo  : String @title:'Order Number'; //> readable key
  Customer : Association to Customers;  
  Items    : Composition of many OrderItems on Items.parent = $self;
  total    : Decimal(9,2) @readonly;
  currency : Currency;
}
entity OrderItems  {
  key ID : cds.UUID;
  parent  : Association to Orders not null;
  book   : Association to bookshop.Books;
  amount : Integer;
  netAmount: Decimal(9,2);
}

entity Customers : managed {
  key ID : UUID;
  Email : String;
  FirstName : String;
  LastName : String;
  CreditCardNo : String;
  dateOfBirth  : Date;
}