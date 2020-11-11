// Proxy for importing schema from bookshop sample
using { sap.capire.bookshop.Books }        from '@capire/bookshop';
using { sap.capire.bookshop.Orders }       from '@capire/orders';
using { sap.capire.bookshop.OrderItems }   from '@capire/orders';
using { Country, managed, cuid }           from '@sap/cds/common';

namespace sap.capire.bookshop;

extend Orders with { 
  Customer : Association to Customers; 
}  

entity Customers : cuid, managed {
  email        : String;
  firstName    : String;
  lastName     : String;
  creditCardNo : String;
  dateOfBirth  : Date;
}

entity CustomerPostalAddress : cuid, managed {
  Customer       : Association to one Customers;
  street         : String(128);
  town           : String(128);
  country        : Country;
  someOtherField : String(128);
};
