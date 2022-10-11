using { sap.capire.performance as my } from '../db/schema';

service PerformanceService {
  entity OrdersHeaders as projection on my.OrdersHeaders;
  entity OrdersItems   as projection on my.OrdersItems;
  entity Books      as projection on my.Books;
  entity Authors      as projection on my.Authors;

// static
view OrdersItemsViewJoin as select 

    OrdersHeaders.ID        as Header_ID, 
    OrdersHeaders.OrderNo   as OrderNo, 
    OrdersHeaders.buyer     as buyer, 
    OrdersHeaders.currency  as currency,
    key OrdersItems.ID      as Item_ID,
    OrdersItems.product     as product,
    OrdersItems.quantity    as quantity,
    OrdersItems.title       as title,
    OrdersItems.price       as price

 from OrdersHeaders JOIN OrdersItems on OrdersHeaders.ID = OrdersItems.Header.ID;

// dynamic entity
entity OrderItemsViewAssoc as projection on OrdersHeaders;

// sort on right table
view SortedOrdersJoin as select 
    OrdersHeaders.ID        as Header_ID, 
    OrdersHeaders.OrderNo   as OrderNo, 
    OrdersHeaders.buyer     as buyer, 
    OrdersHeaders.currency  as currency,
    key OrdersItems.ID      as Item_ID,
    OrdersItems.product     as product,
    OrdersItems.quantity    as quantity,
    OrdersItems.title       as title,
    OrdersItems.price       as price
from OrdersHeaders JOIN OrdersItems on OrdersHeaders.ID = OrdersItems.Header.ID
order by title;

// sort on items and join back to header via assoc

view SortedOrdersAssoc as select
from OrdersItems {*, Header.OrderNo, Header.buyer, Header.currency }
order by OrdersItems.title;

// filter on right table 

view FilteredOrdersJoin as select 
    OrdersHeaders.ID        as Header_ID, 
    OrdersHeaders.OrderNo   as OrderNo, 
    OrdersHeaders.buyer     as buyer, 
    OrdersHeaders.currency  as currency,
    key OrdersItems.ID          as Item_ID,
    OrdersItems.product     as product,
    OrdersItems.quantity    as quantity,
    OrdersItems.title       as title,
    OrdersItems.price       as price
from OrdersHeaders JOIN OrdersItems on OrdersHeaders.ID = OrdersItems.Header.ID
where price > 100;

// filter on items and join back to header via assoc

view FilteredOrdersAssoc as select
from OrdersItems {*, Header.OrderNo, Header.buyer, Header.currency }
where OrdersItems.price > 100;


// TODO avoid CASE and/or JOIN: Denormalization of expensive complex structures, 
// calculate on write instead of read

// CASE -> try to remodel to avoid CASE, if re-modelling is not possible, 
// fill redundant fields at write

entity OrdersItemsCaseView as projection on OrdersItems {
    *,
    case  
       when quantity > 500 then 'Large'
       when quantity > 100 then 'Medium'       
       else 'Small'
    end as category : String
};



}

