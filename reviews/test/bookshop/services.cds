namespace sap.capire.bookshop; //> allows UPDATE('Books')...
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
