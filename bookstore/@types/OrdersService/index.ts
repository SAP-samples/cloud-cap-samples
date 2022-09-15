// This is an automatically generated file. Please do not change its contents manually!
import * as _sap_capire_orders from './../sap/capire/orders';
import * as __ from './../_';
import * as _sap_capire_bookshop from './../sap/capire/bookshop';
import * as _ from './..';





export function Order<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class OrderAspect extends Base {
    OrderNo: string;
    Items: {
    ID: string;
    product: __.Association.to<_sap_capire_orders.Product>;
    quantity: number;
    title: string;
    price: number;
    book: __.Association.to<_sap_capire_bookshop.Book>;
  };
    /**
    * Canonical user ID
    */
    buyer: _.User;
    /**
    * Type for an association to Currencies
    * 
    * See https://cap.cloud.sap/docs/cds/common#type-currency
    */
    currency: __.Association.to<_.Currency>;
  };
}
const OrderXtended = _.cuid(_.managed(Order(__.Entity)))
export type Order = InstanceType<typeof OrderXtended>

export class Orders extends Array<Order> {
}

