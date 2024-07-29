////////////////////////////////////////////////////////////////////////////
//
//    Enhancing bookshop with Reviews and Orders provided through
//    respective reuse packages and services
//


//
//  Extend Books with access to Reviews and average ratings
//
using { sap.capire.bookshop.Books } from '@capire/bookshop';
using { ReviewsService.Reviews } from '@capire/reviews';
extend Books with {
  reviews : Composition of many Reviews on reviews.subject = $self.ID;
  rating  : type of Reviews:rating; // average rating
  numberOfReviews : Integer @title : '{i18n>NumberOfReviews}';
}


//
//  Extend Orders with Books as Products
//
using { sap.capire.orders.Orders } from '@capire/orders';
extend Orders:Items with {
  book : Association to Books on product.ID = book.ID
}

// Ensure models from all imported packages are loaded
using from '@capire/orders/app/fiori';
using from '@capire/data-viewer';
using from '@capire/common';
