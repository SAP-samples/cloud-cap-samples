using { sap.capire.orders, OrdersService, sap.common } from '@capire/fiori/';
// using { sap.common } from '@sap/cds/common'; //> TODO this creates duplicated definitions

namespace Z_bookshop.extension;

extend orders.Orders with {
  Z_priority    : String @assert.range enum {high; medium; low} default 'medium' ;
  Z_SalesRegion : Association to Z_SalesRegion;
}

entity Z_SalesRegion: common.CodeList {
  key regionCode : String(11);
}


// --- UI ---

annotate orders.Orders : Z_priority with @title : 'Priority';
annotate Z_SalesRegion : name       with @title : 'Sales Region';

annotate OrdersService.Orders with @UI.LineItem : [
  ... up to { Value: OrderNo },
  { Value : Z_priority },
  { Value : Z_SalesRegion.name },
  ...
];
