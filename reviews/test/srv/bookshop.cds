// Use enhanced implementation for CatalogService
using { CatalogService } from '@capire/bookshop';
annotate CatalogService with @impl:'srv/bookshop.js';


// Extend Books with access to Reviews and average ratings
using { sap.capire.bookshop.Books } from '@capire/bookshop';
using { ReviewsService.Reviews } from '@capire/reviews';
extend Books with {
  reviews : Composition of many Reviews on reviews.subject = $self.ID;
  rating  : Decimal;
  numberOfReviews : Integer;
}
