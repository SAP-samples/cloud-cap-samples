namespace x_orders.ext; // for new entities, if any
using { OrdersService, sap, sap.capire.orders.Orders } from '@capire/orders';

extend Orders with {
  x_new_field : String(44);
  x_new_field_with_code_list : Association to x_CodeList;
}

entity x_CodeList : sap.common.CodeList {
  key code : String(22)
}

// -------------------------------------------
// Fiori Annotations

annotate Orders:x_new_field with @title: 'New Field';
annotate OrdersService.Orders with @UI.LineItem: [
  ... up to { Value: OrderNo },
  { Value : x_new_field },
  { Value : x_new_field_with_code_list.name },
  ...
];
