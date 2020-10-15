// Proxy for importing schema from bookshop sample
using { sap.capire.bookshop.Books }      from '@capire/bookshop';
using { sap.capire.bookshop.Orders }     from '@capire/orders';
using { sap.capire.bookshop.OrderItems } from '@capire/orders';
using { Currency, managed, cuid }        from '@sap/cds/common';

namespace sap.capire.bookshop;

extend Orders with { 
  Customer : Association to Customers; 
}  

entity Customers : managed {
  key ID : UUID;
  email : String;
  firstName : String;
  lastName : String;
  creditCardNo : String;
  dateOfBirth  : Date;
}