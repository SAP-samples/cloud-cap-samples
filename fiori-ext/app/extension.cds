using { OrdersService, sap, sap.capire.orders.Orders } from '@capire/fiori';
namespace x_bookshop.extension;

// Adding 2 new fields for Orders
extend Orders with {
  x_priority    : String @assert.range enum {high; medium; low} default 'medium' ;
  x_salesRegion : Association to SalesRegion;
}

/** Value Help for x_salesRegion */
entity SalesRegion : sap.common.CodeList {
  key code : String(11);
}

// --- UI ---

annotate Orders:x_priority with @title : 'Priority';
annotate SalesRegion:name with @title : 'Sales Region';

annotate OrdersService.Orders with @UI.LineItem : [
  ... up to { Value: OrderNo },
  { Value : x_priority },
  { Value : x_salesRegion.name },
  ...
];
