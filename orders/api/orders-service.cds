using { cuid, managed, User, Currency } from '@sap/cds/common';
using { sap.capire.orders as my } from '../db/schema';
using { external.Products } from './external';


// GET Orders
// GET Orders()/Items
// GET Orders?$Items

service OwnService {
  entity Orders as projection on OrdersService.Orders;
  entity Products as projection on OrdersService.Products;
}

service OrdersService {

  entity Orders : cuid, managed {
    OrderNo  : String @title:'Order Number'; //> readable key
    Items    : Composition of many Orders_Items; // on Items.up_ = $self;
    // MoreItems    : Composition of many Orders_Items; // on Items.up_ = $self;
     // Items_ID
    buyer    : User;
    currency : Currency;
  }

  entity Orders_Items {
    key ID    : UUID;
    // up_       : Association to Orders;
    product   : Association to Products; //> {ID}
    // product_ID
    amount    : Integer;
    title     : String; //> intentionally replicated as snapshot from product.title
    price     : Double;
  }

  // entity Products {
  //   key ID : UUID;
  // }

}
