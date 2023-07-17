// This is an automatically generated file. Please do not change its contents manually!
import * as _sap_capire_bookshop from './../sap/capire/bookshop';
import * as __ from './../_';
import * as _ from './..';
/**
* For displaying lists of Books
*/
export function _ListOfBookAspect<TBase extends new (...args: any[]) => any>(Base: TBase) {
  return class ListOfBook extends Base {
        ID ?: number;
        title ?: string;
        descr ?: string;
        author ?: __.Association.to<_sap_capire_bookshop.Author>;
        genre ?: __.Association.to<_sap_capire_bookshop.Genre>;
        stock ?: number;
        price ?: number;
    /**
    * Type for an association to Currencies
    * 
    * See https://cap.cloud.sap/docs/cds/common#type-currency
    */
        currency ?: _.Currency;
        image ?: string;
  };
}
export class ListOfBook extends _._managedAspect(_ListOfBookAspect(__.Entity)) {}
export class ListOfBooks extends Array<ListOfBook> {}

/**
* For display in details pages
*/
export function _BookAspect<TBase extends new (...args: any[]) => any>(Base: TBase) {
  return class Book extends Base {
        ID ?: number;
        title ?: string;
        descr ?: string;
        author ?: __.Association.to<_sap_capire_bookshop.Author>;
        genre ?: __.Association.to<_sap_capire_bookshop.Genre>;
        stock ?: number;
        price ?: number;
    /**
    * Type for an association to Currencies
    * 
    * See https://cap.cloud.sap/docs/cds/common#type-currency
    */
        currency ?: _.Currency;
        image ?: string;
  };
}
export class Book extends _._managedAspect(_BookAspect(__.Entity)) {}
export class Books extends Array<Book> {}

// function
export declare const submitOrder: (book: __.DeepRequired<Book>['ID'], quantity: number) => {
    stock ?: number;
};