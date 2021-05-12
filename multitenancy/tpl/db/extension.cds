using {sap.capire.bookshop} from '_base/db/schema';
using {sap.capire.orders}   from '_base/db/schema';
using from '_base/db/capire_common';

using {
    cuid, managed, Country, sap.common.CodeList
} from '@sap/cds/common';


namespace Z_bookshop.extension;

// extend existing entity 
extend orders.Orders with { 
  Z_newField       : String default 'Default Value';
  Z_NewEntity      : Association to one  Z_NewEntity;  
  Z_NewCodeList    : Association to one  Z_NewCodeList; 
  Z_NewCompEntity  : Composition of many Z_NewCompEntity on Z_NewCompEntity.parent = $self;
}  

// new entity - as association target
entity Z_NewEntity : cuid, managed 
{
  description  : String;  
  dateField    : Date;
  integerField : Integer;  
  stringField  : String;
  enumField    : String   @assert.range enum {high; medium; low} default 'medium';
  rangeField   : Decimal  @assert.range: [ 1.0, 100.0 ]          default 50.0;
}

// new entity - as code list
entity Z_NewCodeList : CodeList {
  key code : String(11);
}

// new entity - as composition target
entity Z_NewCompEntity : cuid, managed
{  
  parent       : Association to one orders.Orders;  
  description  : String; 
  dateField    : Date;
  integerField : Integer;
  stringField  : String;
}
