using {sap.capire.bookshop as bookshop } from '../../bookshop/db/schema';
using {sap.capire.orders as orders } from '../../orders/db/schema';

service MultitenancyService {
  entity Books as projection on bookshop.Books;
  entity Orders as projection on orders.Orders;
  entity Orders_Items as projection on orders.Orders_Items;
}

using AdminService   from '../../bookshop/srv/admin-service';
using CatalogService from '../../bookshop/srv/cat-service';

annotate AdminService    with @restrict : false;
annotate CatalogService  with @restrict : false;

