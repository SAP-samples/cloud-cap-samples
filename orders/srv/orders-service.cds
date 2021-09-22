using { sap.capire.orders as my } from '../db/schema';

service OrdersService {
  entity Orders as projection on my.Orders;
}

using from '@capire/common'; //> to have Currencies filled