using { API_BUSINESS_PARTNER as BusinessPartner } from '../srv/external/API_BUSINESS_PARTNER.csn';

/**
 * Supplier data from S/4
 */
@readonly
entity Suppliers as projection on BusinessPartner.A_BusinessPartner {
    *,
    key BusinessPartner as ID,
    BusinessPartnerFullName as fullName,
    BusinessPartnerType as customerType,
    // TODO: Add issue
    // virtual notes: Composition of many Notes on notes.supplier.ID = $self.BusinessPartner;
} excluding {
    OrganizationBPName1, OrganizationBPName2,OrganizationBPName3, OrganizationBPName4, to_BuPaIdentification, to_BuPaIndustry, to_BusinessPartnerAddress, to_BusinessPartnerBank, to_BusinessPartnerContact, to_BusinessPartnerRole, to_BusinessPartnerTax, to_Customer, to_Supplier
}

using { sap.capire.notes.Notes } from './data-model';

extend Notes {
    /**
      * Supplier data from S/4
      */
    supplier: Association to Suppliers;
}

// We'cant add the association to the Suppliers projection yet, so we need to put it to the external entity definition
// TODO: https://github.wdf.sap.corp/cap/matters/projects/44#card-195456
extend BusinessPartner.A_BusinessPartner {
    // [ERROR] db/mashup.cds:28:5: Only an association that points back to this artifact can be compared to "$self" (in entity:"API_BUSINESS_PARTNER.A_BusinessPartner"/element:"note"/on)
    // notes: Composition of many Notes on notes.supplier = $self;
    notes: Composition of many Notes on notes.supplier.ID = $self.BusinessPartner;
}
