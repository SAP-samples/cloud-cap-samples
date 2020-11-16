////////////////////////////////////////////////////////////////////////////
//
//    Mashing up imported models...
//

using { sap.capire.bookshop.Books } from '@capire/bookshop';

//
//  Extend Books with access to Reviews and average ratings
//

using { ReviewsService.Reviews } from '@capire/reviews';
extend Books with {
  reviews : Composition of many Reviews on reviews.subject = $self.ID;
  rating  : Decimal;
}

//
//  Extend Orders with Books as articles
//

using { sap.capire.orders.OrderItems } from '@capire/orders';
extend OrderItems with {
  book : Association to Books on article = book.ID
}
