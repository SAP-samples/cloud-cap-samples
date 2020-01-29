using { sap.capire.bookshop as my } from '../db/schema';
using { API_BUSINESS_PARTNER.A_BusinessPartnerAddress } from './external/API_BUSINESS_PARTNER.csn';

@path:'/browse'
service CatalogService {

  @readonly entity Books as SELECT from my.Books {*,
    author.name as author
  } excluding { createdBy, modifiedBy };

  @readonly entity Addresses as projection on A_BusinessPartnerAddress {
    key AddressID as ID,
    key BusinessPartner,
    StreetName,
    HouseNumber,
    CityName,
    PostalCode,
    Country
  };

  event OrderOutdated { 
    ID: UUID;
  };

  @requires_: 'authenticated-user'
  @insertonly entity Orders as projection on my.Orders;

}
