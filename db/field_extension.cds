using {sap.capire.bookshop} from '_base/db/schema';
using {sap.capire.orders} from '_base/db/schema';
using from '_base/db/capire_common';

using {
  cuid,
  managed,
  Country,
  sap.common.CodeList
} from '@sap/cds/common';


namespace Z_bookshop.fieldExtension;


// extend existing entity
extend orders.Orders with {
  Z_orderInfo        : String default 'Webshop order';
  Z_internalNo       : Integer; // uniqiue constraint
  Z_expectedDelivery : Date; //mandatory
  Z_priority         : String
      @assert.range enum {
      high;
      medium;
      low
    } default 'medium';
    Z_discount       : Decimal
      @assert.range : [
        0.0,
        99.9
      ] default 0.0;
    }


// new unique constraint (secondary index)
annotate orders.Orders with @assert.unique : {Z_internalNo : [Z_internalNo]} {
  Z_expectedDelivery @mandatory; // mandatory check
}
