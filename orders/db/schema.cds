using { Currency, User, managed, cuid, sap.common.CodeList } from '@sap/cds/common';
namespace sap.capire.orders;

entity Orders : cuid, managed {
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many Orders_Items on Items.up_ = $self;
  buyer    : User;
  currency : Currency;
  status   : Association to OrderStatus;
}

@cds.persistence.data.kind: 'config'
entity OrderStatus : CodeList { key code: String(1) }

entity Orders_Items {
  key ID    : UUID;
  up_       : Association to Orders;
  product   : Association to Products @assert.integrity:false; // REVISIT: this is a temporary workaround for a glitch in cds-runtime
  quantity  : Integer;
  title     : String; //> intentionally replicated as snapshot from product.title
  price     : Double;
}

/** This is a stand-in for arbitrary ordered Products */
entity Products @(cds.persistence.skip:'always') {
  key ID : String;
}
