/*
  Optionally add projections to external entities, to capture what
  you actually want to use from there.
 */

using { sap.capire.bookshop as bookshop } from '@capire/bookshop';
using { API_BUSINESS_PARTNER as S4 } from './external/API_BUSINESS_PARTNER.csn';

@cds.autoexpose // or expose explicitly in Catalog and AdminService
@cds.persistence: {table,skip:false} // add persistency
@readonly
entity sap.capire.bookshop.Suppliers as projection on S4.A_BusinessPartner {
    key BusinessPartner as ID,
    BusinessPartnerFullName as name
}

/*
  You can also expose external entities through your own services
  For this to work, you need to delegate the respective calls
  addressed to your services into calls to the external service.
 */
extend service AdminService with {
  entity Suppliers as projection on bookshop.Suppliers;
}


/*
  You can mashup entities from external services, or projections
  thereof, with your project's own entities
 */
using { sap.capire.bookshop.Books, CatalogService } from '@capire/bookshop';
extend Books with {
  supplier : Association to bookshop.Suppliers;
}

/**
  Having locally cached replicas also allows us to display supplier
  data in lists of books, which otherwise would generate unwanted
  traffic on S4 backends.
 */
extend projection CatalogService.ListOfBooks with {
  supplier.name as supplier
}

// Extend S4 service with an event (events are not included in EDMX files)
extend service S4 {
  @type: 'sap.s4.beh.businesspartner.v1.BusinessPartner.Changed.v1'
  event BusinessPartner.Changed {
    BusinessPartner: S4.A_BusinessPartner:BusinessPartner;
  }
}
