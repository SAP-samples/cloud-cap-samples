/*
  In this model we demonstrate how to add Genres to Books in
  as if it was an external extension. For example we use
  CDS Aspects' to extend the core domain model's Books entity
  as well as the AdminService.
 */

namespace sap.capire.bookshop;
using { sap.capire.reviews.ReviewsService as external } from '@sap/capire-reviews';
using { sap.capire.bookshop.Books } from '@sap/capire-bookshop/db/schema';
using { sap.common.CodeList } from '@sap/cds/common';

// Extending Books by Reviews and Genres
extend Books with {
  reviews : Composition of many external.Reviews on reviews.subject = ID;
  rating : external.Reviews.rating;
  genre : Association to Genres;
}

// Hierarchical Code List for Genres
entity Genres : CodeList {
  key ID : Integer;
  children : Composition of many Genres on children.parent = $self;
  parent : Association to Genres;
}
