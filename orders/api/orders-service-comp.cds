using { cuid, managed, User, Currency } from '@sap/cds/common';
using { sap.capire.orders as my } from '../db/schema';
using { external.Products } from './external';


service OrdersService {

  entity Orders : cuid, managed {
    OrderNo  : String @title:'Order Number'; //> readable key
    Items    : Composition of many {
      key ID    : UUID;
      product   : Association to Products;
      amount    : Integer;
      title     : String; //> intentionally replicated as snapshot from product.title
      price     : Double;
    };
    buyer    : User;
    currency : Currency;
  }

}
