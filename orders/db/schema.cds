using { Currency, User, managed, cuid } from '@sap/cds/common';
// using {Orders, OrderItems} from './schema';

namespace sap.capire.orders;

entity Products {
  key ID : String;
}

entity OrdersHeaders : managed {
  key ID   : UUID;
  OrderNo  : String @title:'Order Number'; //> readable key 
  buyer    : User;
  currency : Currency;
  Items    : Composition of many OrdersItems on Items.Header = $self;
}

entity OrdersItems   {
    key ID    : UUID;
    product   : Association to Products;
    quantity  : Integer;
    title     : String; //> intentionally replicated as snapshot from product.title
    price     : Double; //> materialized calculated field
    Header    : Association to OrdersHeaders;  
};



    



