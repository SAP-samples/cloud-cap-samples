////////////////////////////////////////////////////////////////////////////
//
//    Enhancing bookshop with Reviews and Orders provided through
//    respective reuse packages and services
//

using { sap.capire.bookshop.Books } from '@capire/bookshop';

//
//  Extend Books with access to Reviews and average ratings
//
using { ReviewsService.Reviews } from '@capire/reviews';
extend Books with {
  reviews : Composition of many Reviews on reviews.subject = $self.ID;

  @Common.Label : '{i18n>Rating}'
  rating  : Decimal;

  @Common.Label : '{i18n>NumberOfReviews}'
  numberOfReviews : Integer;
}


//
//  Extend Orders with Books as Products
//
using { sap.capire.orders.Orders } from '@capire/orders';
extend Orders with {
  extend Items with {
    book : Association to Books on product.ID = book.ID
  }
}


// Add orders fiori app (in case of embedded orders service)
using from '@capire/orders/app/fiori';

// Add data browser
using from '@capire/data-viewer';

// Incorporate pre-build extensions from...
using from '@capire/common';
