////////////////////////////////////////////////////////////////////////////
//
//    Mashing up imported models...
//

//
//  Extend Books with access to Reviews and average ratings
//

using { CatalogService.ListOfBooks, sap.capire.bookshop.Books } from '@capire/bookshop';
using { ReviewsService.Reviews } from '@capire/reviews';
extend Books with {
  reviews : Composition of many Reviews on reviews.subject = $self.ID;
  rating  : Reviews:rating;
}
extend projection ListOfBooks with { rating }

//
//  Extend Orders with Books as Products
//

using { sap.capire.orders.Orders_Items } from '@capire/orders';
extend Orders_Items with {
  book : Association to Books on product.ID = book.ID
}


using { OrdersService.Orders } from '@capire/orders';
// extend service CatalogService with {
//   entity OrdereredBooks as projection on Orders;
// }
