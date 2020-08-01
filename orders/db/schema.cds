using { sap.capire.bookshop.Books } from '@capire/bookshop';
using { Currency, managed, cuid } from '@sap/cds/common';
namespace sap.capire.bookshop;

entity Orders : cuid, managed {
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many OrderItems on Items.parent = $self;
  currency : Currency;
}

entity OrderItems : cuid {
  parent    : Association to Orders;
  book      : Association to Books;
  amount    : Integer;
  netAmount : Decimal(9,2);
}
