// Proxy for importing schema from bookshop sample
using {sap.capire.bookshop.Books} from '../../bookshop/db/schema';
using {sap.capire.orders.Orders} from '../../orders/db/schema';
using {sap.capire.orders.OrderItems} from '../../orders/db/schema';
using {
  Country,
  managed,
  cuid
} from '@sap/cds/common';

namespace sap.capire.bookshop;

extend Orders with {
  customer        : Association to Customers;
  personalComment : String;
}

entity Customers : cuid, managed {
  email       : String;
  firstName   : String;
  lastName    : String;
  dateOfBirth : Date;
  billingData : Composition of BillingData
                  on billingData.customer = $self;
  addresses   : Composition of Addresses
                  on addresses.customer = $self;
}

entity Addresses : cuid, managed {
  customer       : Association to one Customers;
  street         : String(128);
  town           : String(128);
  country        : Country;
  someOtherField : String(128);
};


entity BillingData : cuid, managed {
  customer     : Association to one Customers;
  creditCardNo : String;
};
