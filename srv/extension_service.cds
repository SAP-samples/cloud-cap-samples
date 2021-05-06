using from '_base/srv/admin-service';
using from '_base/srv/cat-service';
using from '_base/srv/orders-service';

using { sap.bookshop.extension as ext } from '../db/extension';

extend service OrdersService with {
   entity Customers as projection on ext.Customers;
}
