using { API_BUSINESS_PARTNER as external } from './external/API_BUSINESS_PARTNER.csn';

/**
 * Tailor the imported API to our needs...
 */
extend service API_BUSINESS_PARTNER with {

  /**
   * Simplified view on external addresses
   */
  @mashup @cds.autoexpose //> for ValueHelps
  entity Addresses as projection on external.A_BusinessPartnerAddress {
    key AddressID as ID,
    key BusinessPartner,
    Country as country,
    CityName as cityName,
    PostalCode as postalCode,
    StreetName as streetName,
    HouseNumber as houseNumber
  };

  /**
   * Re-modelling the event which is currently not available declaratively from S/4
   */
  // @messaging.topic:'${prefix}/BusinessPartner/Changed'
  event "BusinessPartner/Changed" {
    "KEY": array of {
      BUSINESSPARTNER : external.A_BusinessPartner.BusinessPartner
    }
  }
}


/**
 * Mashup w/ services to also serve shipping addresses
 */
using { AdminService } from './admin-service';
extend service AdminService {
  // entity usersAddresses as projection on external.Addresses;
}

// TODO: not used so far...
using { CatalogService } from './cat-service';
extend service CatalogService {
  @readonly @requires:'authenticated-user'
  entity usersAddresses as projection on external.Addresses;
}


/**
 * Mashup w/ domain model for federated data access
 */
using { sap.capire.bookshop } from '../db/schema';

/**
 * Extend Orders to maintain references to (replicated) external Addresses
 */
extend bookshop.Orders with {
  shippingAddress : Association to bookshop.Addresses;
}

/**
 * Add an entity to replicate external address data for quick access,
 * e.g. when displaying lists of orders.
 */
@cds.persistence:{table,skip:false}
entity sap.capire.bookshop.Addresses as SELECT from external.Addresses { *,
  false as tombstone : Boolean
};
