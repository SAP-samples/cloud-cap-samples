using { sap.capire, sap.capire.bookshop.Books } from '@capire/bookshop';
using { API_BUSINESS_PARTNER as external } from './external/API_BUSINESS_PARTNER.csn';

extend Books with {
  supplier : Association to Suppliers;
}

extend service CatalogService with {
  entity MySuppliers as projection on Suppliers;
}

@cds.persistence:{table,skip:false}
entity Suppliers as projection on external.A_BusinessPartner {
  BusinessPartner as ID,
  LastName,
  AcademicTitle
}
