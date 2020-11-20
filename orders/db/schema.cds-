using { Currency, User, managed, cuid } from '@sap/cds/common';
using from '@capire/common';
namespace sap.capire.orders;

entity Orders : cuid, managed {
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many Orders_Items on Items.up_ = $self;
  buyer    : User;
  currency : Currency;
}

entity Orders_Items {
  up_       : Association to Orders not null;  //> IMPORTANT for Draft: not key(!)
  key ID    : UUID;
  @assert.integrity:false // REVISIT: this is a temporary workaround for a glitch in cds-runtime
  product   : Association to Products;
  amount    : Integer;
  title     : String;
  price     : Double;
}

/** This is a stand-in for arbitrary ordered Products */
@cds.persistence.skip:'always'
entity Products {
  key ID : String;
}
