//
//  Extending Books with Reviews
//

using { sap.capire.bookshop.Books } from '@capire/bookshop';
using { ReviewsService.Reviews } from '@capire/reviews';

extend Books with {
  /** Access to detailed collection of Reviews */
  reviews : Composition of many Reviews on reviews.subject = $self.ID;
  /** Average rating */
  rating : Reviews.rating;
}

//////////////////////////////////////////////////////////////////////////////
// BUG in compiler: we have to force-include cat-service after admin-service
// see cap/issues#4112; when fixed we can rempve these lines
//
  using from '@capire/bookshop/srv/admin-service';
  using from '@capire/bookshop/srv/cat-service';
//
//////////////////////////////////////////////////////////////////////////////
