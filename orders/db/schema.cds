using { Currency, User, managed, cuid } from '@sap/cds/common';
namespace sap.capire.orders;

entity Orders : cuid, managed {
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many Orders_Items on Items.up_ = $self;
  buyer    : User;
  currency : Currency;
}

entity Orders_Items {
  key ID    : UUID;
  up_       : Association to Orders;
  product   : Association to Products;
  quantity  : Integer;
  title     : String; //> intentionally replicated as snapshot from product.title
  price     : Double;
}

/** This is a stand-in for arbitrary ordered Products */
entity Products @(cds.persistence.skip:'always') {
  key ID : String;
}




// this is to ensure we have filled-in currencies
using from '@capire/common';
