using { Currency, User, managed, cuid } from '@sap/cds/common';
using from '@capire/common';
namespace sap.capire.orders;

entity Orders : cuid, managed {
  OrderNo  : String @title:'Order Number'; //> readable key
  Items    : Composition of many OrderItems on Items.order = $self;
  buyer    : User;
  currency : Currency;
}

entity OrderItems {
  key ID    : UUID;
  order     : Association to Orders;
  amount    : Integer;
  article   : String; //> to allow for arbitrary keys
  title     : String;
  price     : Double;
}
