namespace sap.capire.orders;
using { Currency, cuid, managed } from '@sap/cds/common';


entity Orders : cuid, managed {
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many OrderItems on Items.parent = $self;
  currency : Currency;
}

entity OrderItems : cuid {
  parent    : Association to Orders not null;
  article   : String;
  amount    : Integer;
}
