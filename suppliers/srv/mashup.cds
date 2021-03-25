/*
  Optionally add projections to external entities, to capture what
  you actually want to use from there.
 */

using {API_BUSINESS_PARTNER as S4} from './external/API_BUSINESS_PARTNER.csn';

@cds.autoexpose // or expose explicitly in Catalog and AdminService
@cds.persistence: {table,skip:false}
entity sap.capire.bookshop.Suppliers as projection on S4.A_BusinessPartner {
  key BusinessPartner as ID, BusinessPartnerFullName as name
}

using { sap.capire.bookshop.Books, CatalogService } from '@capire/bookshop';
extend Books with {
  supplier: Association to sap.capire.bookshop.Suppliers;
}

extend service AdminService with { // why is AdminService visible?
  entity Suppliers as projection on sap.capire.bookshop.Suppliers;
}

extend projection CatalogService.ListOfBooks with {
  supplier
}
