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
  product   : Association to Products @assert.integrity:false; // REVISIT: this is a temporary workaround for a glitch in cds-runtime
  amount    : Integer;
  title     : String;
  price     : Double;
}

/** This is a stand-in for arbitrary ordered Products */
entity Products @(cds.persistence.skip:'always') {
  key ID : String;
}

// Activate extension package
using from '@capire/common';
