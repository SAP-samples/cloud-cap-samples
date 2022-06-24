using {
  Country,
  managed,
  cuid
} from '@sap/cds/common';
using {sap.capire.orders} from '@capire/orders';

namespace sap.capire.gdpr;

extend orders.Orders with {
  customer : Association to Customers;
}

entity Customers : cuid, managed {
  email        : String;
  firstName    : String;
  lastName     : String;
  creditCardNo : String;
  dateOfBirth  : Date;
  addresses    : Composition of many CustomerPostalAddresses
                   on addresses.customer = $self;
}

entity CustomerPostalAddresses : cuid, managed {
  customer : Association to Customers;
  street   : String(128);
  town     : String(128);
  @assert.integrity : false
  country  : Country;
};
