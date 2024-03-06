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
using { managed, cuid } from '@sap/cds/common';

extend Books with {
  reviews : Composition of many Reviews on reviews.subject = $self.ID;
  rating  : type of Reviews:rating; // average rating
  numberOfReviews : Integer @title : '{i18n>NumberOfReviews}';
  Y_characteristics : Composition of many Y_Characteristic on Y_characteristics.parent = $self;
}

entity Y_Characteristic : cuid, managed {
  parent      : Association to one Books;
  characteristicId : String;
  name  : String;
  value : String;
  uom : String;
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
