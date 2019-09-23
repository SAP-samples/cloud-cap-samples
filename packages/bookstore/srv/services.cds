namespace sap.capire.bookstore;

using { sap.capire.products.Products, sap.capire.bookstore as my } from '../db/schema';

service CatalogService {
  @readonly entity Books as projection on Products {
    *, category.name as category, author.name
  } excluding { createdBy, modifiedBy };

  @insertonly entity Orders as projection on my.Orders;
}

// Reuse services from @sap/capire-products...
using { sap.capire.products.AdminService } from '@sap/capire-products';
extend service AdminService with {
  entity Authors as projection on my.Authors;
}