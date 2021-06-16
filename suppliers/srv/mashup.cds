using { API_BUSINESS_PARTNER as S4 } from './external/API_BUSINESS_PARTNER.csn';
using { CatalogService, sap.capire.bookshop.Books } from '@capire/bookshop';
namespace sap.capire.bookshop;


/**
  Add projections to external entities to capture the subset of fields we're
  actually interested in. This fosters both: (a) minimized network traffic as
  well as (b) options to dynamically add extension fields by SaaS tenants.
 */
@cds.odata.valuelist
entity Suppliers as projection on S4.A_BusinessPartner {
    key BusinessPartner as ID,
    BusinessPartnerFullName as name,
    // to_BusinessPartnerAddress[1: ValidityStartDate <= $now and $now < ValidityEndDate].CityName,
    // to_BusinessPartnerAddress[1: ValidityStartDate <= $now and $now < ValidityEndDate].Country,
}


/**
  We can mashup entities from external services, or projections thereof, with
  our project's own entities, e.g. by adding relationships as below.
 */
extend Books with {
  supplier : Association to Suppliers;
}


/*
  Optionally expose external entities through own services, e.g. for Value Helps,
  or to display details fetched on demand.
  For this to work, we need to delegate the respective calls addressed to our
  services into calls to the external service.
 */
extend service AdminService with {
  entity Suppliers as projection on bookshop.Suppliers;
}


/*
  Optionally add local persistency to replicate data for fast access,
  e.g. to display lists containing remote data.
 */
annotate Suppliers with @cds.persistence: {table,skip:false};


/**
  Having locally cached replicas also allows to display supplier data in lists
  of books, which otherwise would generate unwanted traffic on S4 backends.
 */
extend projection CatalogService.ListOfBooks with {
  supplier.name as supplier
}


/**
  Optionally declare events emitted from the source, but not included in
  imported APIs (e.g. as in case of EDMXes from API Hub).

  This allows CAP's advanced support for events and messaging to kick in,
  e.g. to automatically emit to and subscribe to events from message brokers
  behind the scenes.

  Note: as sync and async APIs from S/4 sources are not correlated, we have
  to specify the event type names, e.g. as be found at:
  https://api.sap.com/event/SAPS4HANACloudBusinessEvents_BusinessPartner/resource
 */
extend service S4 {
  event BusinessPartner.Changed @(type: 'sap.s4.beh.businesspartner.v1.BusinessPartner.Changed.v1') {
    BusinessPartner: S4.A_BusinessPartner:BusinessPartner;
  }
}
