/*
  Optionally add projections to external entities, to capture what
  you actually want to use from there.
 */

using { sap.capire.bookshop as bookshop } from '@capire/bookshop';
using { API_BUSINESS_PARTNER as S4 } from './external/API_BUSINESS_PARTNER.csn';

@cds.autoexpose // or expose explicitly in Catalog and AdminService
@cds.persistence: {table,skip:false} // add persistency
entity sap.capire.bookshop.Suppliers as projection on S4.A_BusinessPartner {
    // TODO: Aliases not supported in Java, yet?
    key BusinessPartner as ID,
    BusinessPartnerFullName as name,

    // REVISIT: following is not supported so far in cds compiler...
    // to_BusinessPartnerAddress as city {
    //    CityCode as code,
    //    CityName as name
    // }

    // to_BusinessPartnerAddress

    // REVISIT: following is not supported so far in cqn2odata...
    // to_BusinessPartnerAddress.CityCode as city,
    // to_BusinessPartnerAddress.CityName as city_name,
}


// REVISIT: Alternative idea to use a specific replication view, but request data from
// a different view and manual map values.
// entity ReplicatedSuppliers as projection on Suppliers {
//   ID,
//   name,
//   to_BusinessPartnerAddress.CityCode as city,
//   to_BusinessPartnerAddress.CityName as city_name
// }




/*
  You can mashup entities from external services, or projections
  thereof, with your project's own entities
 */
using { sap.capire.bookshop.Books, CatalogService } from '@capire/bookshop';
extend Books with {
  supplier : Association to bookshop.Suppliers;
}


/*
  You can also expose external entities through your own services
  For this to work, you need to delegate the respective calls
  addressed to your services into calls to the external service.
 */
extend service AdminService with {
  entity Suppliers as projection on bookshop.Suppliers;
}

/**
  Having locally cached replicas also allows us to display supplier
  data in lists of books, which otherwise would generate unwanted
  traffic on S4 backends.
 */
extend projection CatalogService.ListOfBooks with {
  supplier
}

// Extend S4 service with not modelled event
extend service S4 {
  @topic: 'BusinessPartner/Changed'
  event BusinessPartner.Changed {
    BusinessPartner: S4.A_BusinessPartner:BusinessPartner;
  }
}