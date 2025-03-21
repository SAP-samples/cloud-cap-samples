using { sap.capire.orders as my } from '../db/schema';

service OrdersService {
  entity Orders as projection on my.Orders;

  event OrderChanged {
    product: String;
    deltaQuantity: Integer;
  }

  @odata.draft.bypass
  @(requires: 'system-user')
  entity OrdersNoDraft as projection on my.Orders;

}
