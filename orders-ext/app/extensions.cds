namespace x_orders.ext; // for new entities like SalesRegion below
using { OrdersService, sap, sap.capire.orders.Orders } from '@capire/orders';

extend Orders with { // 2 new fields....
  x_priority    : String enum {high; medium; low} default 'medium';
  x_salesRegion : Association to x_SalesRegion;
}

entity x_SalesRegion : sap.common.CodeList { // Value Help
  key code : String(11);
}


// -------------------------------------------
// Fiori Annotations

annotate Orders:x_priority with @title: 'Priority';
annotate x_SalesRegion:name with @title: 'Sales Region';

annotate OrdersService.Orders with @UI.LineItem: [
  ... up to { Value: OrderNo },
  { Value: x_priority },
  { Value: x_salesRegion.name },
  ...
];
