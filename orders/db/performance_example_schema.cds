using { Currency, User, managed, cuid } from '@sap/cds/common';
using {Orders, OrderItems} from '../schema';

namespace sap.capire.orders;

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


// static
view OrdersItemsViewJoin as select 

    OrdersHeaders.ID        as Header_ID, 
    OrdersHeaders.OrderNo   as OrderNo, 
    OrdersHeaders.buyer     as buyer, 
    OrdersHeaders.currency  as currency,
    OrdersItems.ID          as Item_ID,
    OrdersItems.product     as product,
    OrdersItems.quantity    as quantity,
    OrdersItems.title       as title,
    OrdersItems.price       as price

 from OrdersHeaders JOIN OrdersItems on OrdersHeaders.ID = OrdersItems.Header;

// dynamic entity
entity OrderItemsViewAssoc as projection on Orders;

// sort on right table 
view SortedOrdersJoin as select 
    OrderNo, 
    buyer, 
    currency,
    Item_ID,
    product,
    quantity,
    title,
    price    
from OrdersItemsViewJoin 
order by title;

// sort on items and join back to header via assoc
view SortedOrdersAssoc as select
from OrdersItems {*, Header.OrderNo, Header.buyer, Header.currency }
order by OrdersItems.title;
