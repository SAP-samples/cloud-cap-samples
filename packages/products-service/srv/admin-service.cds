using { sap.capire.products as db } from '../db/schema';
namespace sap.capire.products;

service AdminService @(_requires:'admin') {
  entity Products as projection on db.Products;
  entity Categories as projection on db.Categories;
}
