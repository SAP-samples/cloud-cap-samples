using { Currency, User, managed, cuid } from '@sap/cds/common';
namespace sap.capire.orders;

entity Orders : cuid, managed {
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many Orders.Items on Items.up_ = $self;
  buyer    : User;
  currency : Currency;
}

entity Orders.Items {
  /*key*/ up_   : Association to Orders; // REVISIT: 'key' doesn't work due to bug in runtime
  key ID    : UUID;
  product   : Association to Products;
  amount    : Integer;
  title     : String; //> intentionally replicated as snapshot from product.title or alike
  price     : Double;
}

/** This is a stand-in for arbitrary ordered Products */
entity Products @(cds.persistence.skip:'always') {
  key ID : String;
}
