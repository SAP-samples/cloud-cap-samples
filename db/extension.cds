using {sap.capire.bookshop} from '_base/db/schema';
using {sap.capire.orders}   from '_base/db/schema';
using from '_base/db/capire_common';

using {
    cuid, managed, Country, sap.common.CodeList
} from '@sap/cds/common';



namespace Z_bookshop.extension;


// extend existing entity 
extend orders.Orders with { 
  Z_Customer    : Association to one Z_Customers;  
  Z_SalesRegion : Association to one Z_SalesRegion; 
  Z_priority    : String @assert.range enum {high; medium; low} default 'medium';
 // Z_Remarks     : Composition of many Z_Remarks on Z_Remarks.parent = $self;
}  


// new entity - as association target
entity Z_Customers : cuid, managed 
{
  email        : String;
  firstName    : String;
  lastName     : String; 
  creditCardNo : String;
  dateOfBirth  : Date;
  status       : String   @assert.range enum {platinum; gold; silver; bronze} default 'bronze';
  creditScore  : Decimal  @assert.range: [ 1.0, 100.0 ] default 50.0;
  PostalAddresses : Composition of many Z_CustomerPostalAddresses on PostalAddresses.Customer = $self;
}

// new unique constraint (secondary index)
annotate Z_Customers with @assert.unique: { email: [ email ] }   
{
   email @mandatory;    // mandatory check
}

// new entity - as composition target
entity Z_CustomerPostalAddresses : cuid, managed 
{
  Customer       : Association to one Z_Customers;
  description    : String;
  street         : String;
  town           : String;
  country        : Country;
}

// new entity - as code list
entity Z_SalesRegion: CodeList {
  key regionCode : String(11);
}


// new entity - as composition target
entity Z_Remarks : cuid, managed
{  
  parent      : Association to one orders.Orders;  
  number      : Integer;  
  remarksLine : String; 
}

