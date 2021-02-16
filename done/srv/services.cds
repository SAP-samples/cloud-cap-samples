/*
  Optionally add projections to external entities, to capture what
  you actually want to use from there.
 */

using { API_BUSINESS_PARTNER as S4 } from './external/API_BUSINESS_PARTNER.csn';
extend service S4 with {
  entity Suppliers as projection on S4.A_BusinessPartner {
    key BusinessPartner as ID,
    BusinessPartnerFullName as name,
    to_BusinessPartnerAddress.CityName as city
  }
}


/*
  You can mashup entities from external services, or projections
  thereof, with your project's own entities
 */
using { sap.capire.bookshop.Books } from '@capire/bookshop';
extend Books with {
  supplier : Association to S4.Suppliers;
}


/*
  You can also expose external entities through your own services
  For this to work, you need to delegate the respective calls
  addressed to your services into calls to the external service.
 */
extend service AdminService with {
  entity Suppliers as projection on S4.Suppliers;
}

/*
  Optionally add a local persistence to keep replicas of external
  entities to have data in fast access locally; much like a cache.
 */
annotate S4.Suppliers with @cds.persistence:{table,skip:false};

/**
  Having locally cached replicas also allows us to display supplier
  data in lists of books, which otherwise would generate unwanted
  traffic on S4 backends.
 */
extend projection CatalogService.ListOfBooks with {
  supplier
}

/*
  The following using directives activate imported reuse packages.
 */
using from '@capire/common';
using from '@capire/orders';
using from '@capire/reviews';
