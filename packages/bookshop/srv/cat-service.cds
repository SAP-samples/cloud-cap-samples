using { sap.capire.bookshop as my } from '../db/schema';

@path:'/browse'
service CatalogService {

  @readonly entity Books as SELECT from my.Books {*,
    author.name as author
  } excluding { createdBy, modifiedBy };

  @requires_: 'authenticated-user'
  entity Orders as projection on my.Orders;

}
// Example for an instance restriction
 annotate CatalogService.Orders with  @(restrict: [
   { grant: 'READ', where: 'currency_code = $user.currency'  } 
  ]);