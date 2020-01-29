using { sap.capire.bookshop as my } from '../db/schema';
using { API_BUSINESS_PARTNER as external } from './external/API_BUSINESS_PARTNER.csn';

@path:'/browse'
service CatalogService {

  @readonly entity Books as SELECT from my.Books {*,
    author.name as author
  } excluding { createdBy, modifiedBy };

  @readonly entity BusinessPartners as projection on external.A_BusinessPartner {
    key BusinessPartner as ID,
    FirstName,
    MiddleName,
    LastName,
    IsMarkedForArchiving
  };

  event OrderMadeObsolete {
    ID: UUID;
  };

  @requires_: 'authenticated-user'
  @insertonly entity Orders as projection on my.Orders;

}
