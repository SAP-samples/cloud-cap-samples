namespace sap.capire.bookshop;
using { sap.capire.reviews.ReviewsService as external } from '@capire/reviews';
using { sap.capire.bookshop.Books } from '@capire/bookshop/db/schema';

// Extending Books by Reviews
extend Books with {
  reviews : Composition of many external.Reviews on reviews.subject = ID;
  rating : external.Reviews.rating;
}

using from '@capire/bookshop/srv/admin-service';
using from '@capire/bookshop/srv/cat-service';
annotate AdminService with @impl:'services.js';
