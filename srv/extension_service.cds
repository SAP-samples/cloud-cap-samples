using from '_base/srv/admin-service';
using from '_base/srv/cat-service';
using from '_base/srv/orders-service';

using { Z_bookshop.extension as ext } from '../db/extension';


extend service OrdersService with {
   entity Z_Customers   as projection on ext.Z_Customers;
   entity Z_SalesRegion as projection on ext.Z_SalesRegion;
}

