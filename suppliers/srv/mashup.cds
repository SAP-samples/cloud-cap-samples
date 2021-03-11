/*
  Optionally add projections to external entities, to capture what
  you actually want to use from there.
 */

using {API_BUSINESS_PARTNER as S4} from './external/API_BUSINESS_PARTNER.csn';

context replica {
  @cds.autoexpose // or expose explicitly in Catalog and AdminService
  @cds.persistence: {table, skip: false}
  entity Suppliers as projection on S4.A_BusinessPartner {
    key BusinessPartner as ID, 
    BusinessPartnerFullName as name
  }
}

using { sap.capire.bookshop.Books, CatalogService } from '@capire/bookshop';
extend Books with {
  supplier : Association to replica.Suppliers;
}

extend service AdminService with { // why is AdminService visible?
  entity Suppliers as projection on replica.Suppliers;
}

extend projection CatalogService.ListOfBooks with {
  supplier
}
