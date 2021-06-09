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

    //// REVISIT: Should this be here or in the service, when it is only used for Fiori?
    //// Compositions should work as well
    //// The version with "virtual" is prefered, as this makes clear that the association is "added" here
    // virtual books: Association to Books on book.supplier = $self,
    // books2: Association to Books on book.supplier = $self,
    //// Add virtual field, that does'nt exisits in the persistence or the underlying service
    // virtual saveEnabled: Boolean
} excluding {
    OrganizationBPName1, OrganizationBPName2,OrganizationBPName3, OrganizationBPName4, to_BuPaIdentification, to_BuPaIndustry, to_BusinessPartnerAddress, to_BusinessPartnerBank, to_BusinessPartnerContact, to_BusinessPartnerRole, to_BusinessPartnerTax, to_Customer, to_Supplier
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
  supplier.name as supplier
}

// Extend S4 service with an event (events are not included in EDMX files)
extend service S4 {
  @type: 'sap.s4.beh.businesspartner.v1.BusinessPartner.Changed.v1'
  event BusinessPartner.Changed {
    BusinessPartner: S4.A_BusinessPartner:BusinessPartner;
  }
}