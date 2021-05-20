using {sap.capire.bookshop} from '_base/db/schema';
using {sap.capire.orders}   from '_base/db/schema';
using from '_base/db/capire_common';

using {
    cuid, managed, Country, sap.common.CodeList
} from '@sap/cds/common';


namespace Z_bookshop.extension;

// extend existing entity 
extend orders.Orders with { 
  Z_newDefaultField   : String   default 'Default Value';
  Z_description       : String;  
  Z_dateField         : Date;
  Z_integerField      : Integer;  
  Z_stringField       : String;
  Z_enumField         : String   @assert.range enum {high; medium; low} default 'medium';
  Z_rangeField        : Decimal  @assert.range: [ 1.0, 100.0 ]          default 50.0;
}  
