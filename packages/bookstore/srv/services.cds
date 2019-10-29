namespace sap.capire.bookstore;

// Service for all users to browse books
using { sap.capire.products } from '../db/schema';

service CatalogService @(path:'browse'){

  @readonly entity Books as select from products.Products { *,
    author.firstname ||' '|| author.lastname as author : String,
    category.name as genre,
  } excluding { createdBy, modifiedBy };

  @readonly entity Genres as projection on products.Categories;

}

// Reuse AdminService from @sap/capire-products...
using { sap.capire.products.AdminService } from '@sap/capire-products';
using { sap.capire.bookstore as my } from '../db/schema';

extend service AdminService with @(impl:'srv/services.js') {
  entity Authors as projection on my.Authors;
}

// Adding reviews via @sap/capire-reviews service
using { sap.capire.reviews.ReviewsService as external } from '@sap/capire-reviews';
extend service CatalogService with {
  @readonly entity Reviews as projection on external.Reviews;
}


// Adding images via @sap/capire-media service
using from '@sap/capire-media';
// using from '@sap/capire-orders';
// using from '@sap/capire-users';
