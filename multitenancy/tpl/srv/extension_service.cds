using from '_base/srv/admin-service';
using from '_base/srv/cat-service';
using from '_base/srv/orders-service';

using { Z_bookshop.extension as ext } from '../db/extension';

extend service OrdersService with {
   entity Z_NewEntity   as projection on ext.Z_NewEntity ;
   entity Z_NewCodeList as projection on ext.Z_NewCodeList;
}