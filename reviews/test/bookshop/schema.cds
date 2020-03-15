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

// Temporary workaround for cap/issues#4112:
annotate Reviews with @cds.autoexpose;
