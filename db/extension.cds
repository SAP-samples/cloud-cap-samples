
using {sap.capire.bookshop} from '_base/db/schema';
using {sap.capire.orders} from '_base/db/schema';
using from '_base/db/capire_common';

using {
    cuid, managed, Country
} from '@sap/cds/common';

namespace sap.bookshop.extension;

// extend existing entity 
extend orders.Orders with { 
  Customer : Association to one Customers; 
  Remarks  : Composition of many Remarks on Remarks.parent = $self;
  priority : String @assert.range enum {high; medium; low} default 'medium';
}  

// new entity - as association target
entity Customers : cuid, managed {
  email        : String;
  firstName    : String;
  lastName     : String; 
  creditCardNo : String;
  dateOfBirth  : Date;
  status       : String   @assert.range enum {platinum; gold; silver; bronze} default 'bronze';
  creditScore  : Decimal  @assert.range: [ 1.0, 100.0 ] default 50.0;
  PostalAddresses : Composition of many CustomerPostalAddresses on PostalAddresses.Customer = $self;
}

// new unique constraint (secondary index)
annotate Customers with @assert.unique: { email: [ email ] }   
{
   email @mandatory;    // mandatory check
}

// new entity - as composition target
entity CustomerPostalAddresses : cuid, managed {
  Customer       : Association to one Customers;
  description    : String;
  street         : String;
  town           : String;
  country        : Country;
};

// new entity - as composition target
entity Remarks : cuid, managed
{  
  parent      : Association to one orders.Orders;  
  number      : Integer;
  remarksLine : String; 
}

