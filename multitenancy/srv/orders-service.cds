using { sap.capire.orders as my } from '../db/schema';

service OrdersService
@(requires:['authenticated-user', 'system-user'])
{
  entity Orders as projection on my.Orders;
}
